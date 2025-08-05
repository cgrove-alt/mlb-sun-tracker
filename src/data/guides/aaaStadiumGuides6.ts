import { StadiumGuide } from '../stadiumGuides';

export const aaaStadiumGuides6: Record<string, StadiumGuide> = {
  'syracuse-mets': {
    id: 'syracuse-mets',
    name: 'NBT Bank Stadium',
    team: 'Syracuse Mets',
    opened: 1997,
    capacity: 11071,
    
    overview: {
      description: 'NBT Bank Stadium in Syracuse features classic brick architecture and hosts the New York Mets Triple-A affiliate in the heart of Central New York.',
      highlights: [
        'Classic brick ballpark design',
        'Downtown Syracuse location',
        'Sky Club premium seating',
        'Mets Triple-A affiliate'
      ],
      uniqueFeatures: [
        'Salt City skyline views',
        'Party City Deck',
        'Natural grass field',
        'Historic baseball city'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper level sections', 'Third base side', 'Sky Club'],
        afternoon: ['Sky Club sections', 'Upper deck overhang', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Party City Deck']
      },
      coveredSeating: ['Sky Club premium seats', 'Upper deck overhang', 'Some concourse areas'],
      shadeTips: [
        'Upper level provides shade below',
        'Third base side for afternoon games',
        'Sky Club has best coverage',
        'Central NY weather varies greatly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Sky Club', 'Suites', 'Indoor concessions']
      },
      worstSunExposure: ['Field level seats', 'First base afternoon', 'Party City Deck early'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 62, rainChance: 30, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 63, avgHumidity: 64, rainChance: 30, typicalConditions: 'Spring weather', shadeTip: 'Sun often welcome' },
        { month: 'June', avgTemp: 73, avgHumidity: 68, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Shade for day games' },
        { month: 'July', avgTemp: 78, avgHumidity: 70, rainChance: 28, typicalConditions: 'Warm summer', shadeTip: 'Upper deck best' },
        { month: 'August', avgTemp: 76, avgHumidity: 72, rainChance: 28, typicalConditions: 'Warm and humid', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 68, avgHumidity: 70, rainChance: 28, typicalConditions: 'Cooling down', shadeTip: 'Perfect weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Sky Club', perks: ['Premium seating', 'Climate controlled', 'Exclusive access'], access: 'Sky Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Party City Deck', description: 'Left field party deck', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Upper reserved'],
      familySections: ['Family seating areas', 'Party City Deck'],
      tips: [
        { section: 'Sky Club', tip: 'Best amenities and shade', category: 'shade' },
        { section: 'Upper level', tip: 'Good value with shade', category: 'value' },
        { section: 'Party City Deck', tip: 'Group party atmosphere', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: [
        'Dinosaur Bar-B-Que',
        'Hofmann hot dogs',
        'Salt potatoes',
        'Syracuse specialties'
      ],
      local: [
        'Central New York favorites',
        'Local craft beers',
        'Upstate specialties'
      ],
      alcohol: {
        beer: ['Local craft selections', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$5-8', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '5-10 minutes', price: 'Varies', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['Centro bus system'],
        rideShare: 'Downtown pickup locations'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'NBT Bank Stadium Way', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Syracuse Mets gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Downtown Location', description: 'Many dining options nearby', category: 'food' },
        { title: 'Dinosaur BBQ', description: 'Must-try local favorite', category: 'food' },
        { title: 'Weather Varies', description: 'Check forecast and dress accordingly', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:35 PM (weekdays), 6:35 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Syracuse',
      description: 'Located near downtown Syracuse with access to Armory Square entertainment district.',
      beforeGame: ['Armory Square restaurants', 'Downtown dining'],
      afterGame: ['Armory Square nightlife', 'Downtown bars'],
      radius: 'Walking distance to downtown'
    },
    
    transportation: {
      address: '1 Tex Simone Drive, Syracuse, NY 13208',
      publicTransit: {
        bus: [{ routes: ['Centro routes'], stops: ['Stadium area'] }]
      },
      driving: {
        majorRoutes: ['I-81', 'I-690', 'Route 5'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'I-690 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated areas',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light to moderate'
      }
    },
    
    history: {
      timeline: [
        { year: 1997, event: 'Stadium opens' },
        { year: 2019, event: 'Becomes Mets affiliate' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Central New York baseball tradition with Mets connection',
      bestExperiences: ['Sky Club experience', 'Party City Deck', 'Dinosaur BBQ'],
      traditions: ['Syracuse baseball heritage', 'Salt City pride']
    },
    
    proTips: {
      insiderTips: [
        'Dinosaur BBQ is must-try',
        'Sky Club worth upgrade',
        'Party City Deck for groups',
        'Downtown has pre-game options'
      ],
      avoidThese: ['Field level in afternoon sun', 'Arriving late for parking'],
      hiddenGems: ['Armory Square before game', 'Sky Club views'],
      photoSpots: ['Downtown skyline views', 'Classic brick architecture'],
      bestValue: ['Upper reserved', 'Weekday specials']
    }
  },

  'toledo-mud-hens': {
    id: 'toledo-mud-hens',
    name: 'Fifth Third Field',
    team: 'Toledo Mud Hens',
    opened: 2002,
    capacity: 10300,
    
    overview: {
      description: 'Fifth Third Field sits along the Maumee River in downtown Toledo, featuring warehouse-style architecture and famous Tony Packo\'s hot dogs.',
      highlights: [
        'Riverfront location',
        'Warehouse district setting',
        'Tony Packo\'s hot dogs',
        'Tigers Triple-A affiliate'
      ],
      uniqueFeatures: [
        'Maumee River views',
        'Glass City Grille',
        'The Roost group area',
        'Downtown Toledo skyline'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Third base side', 'Suite level'],
        afternoon: ['Upper level overhang', 'Glass City Grille', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'The Roost area']
      },
      coveredSeating: ['Glass City Grille', 'Suite level', 'Upper deck overhang'],
      shadeTips: [
        'Upper deck provides shade',
        'Third base side for afternoon',
        'Glass City Grille fully covered',
        'River breeze helps cooling'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Glass City Grille', 'Suites', 'Indoor dining']
      },
      worstSunExposure: ['Field level seats', 'Right field afternoon', 'The Roost early'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 64, rainChance: 32, typicalConditions: 'Cool and variable', shadeTip: 'Layers recommended' },
        { month: 'May', avgTemp: 65, avgHumidity: 66, rainChance: 32, typicalConditions: 'Spring weather', shadeTip: 'Pleasant conditions' },
        { month: 'June', avgTemp: 75, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm', shadeTip: 'Shade for day games' },
        { month: 'July', avgTemp: 79, avgHumidity: 70, rainChance: 28, typicalConditions: 'Hot summer', shadeTip: 'Upper deck or evening' },
        { month: 'August', avgTemp: 77, avgHumidity: 72, rainChance: 28, typicalConditions: 'Warm and humid', shadeTip: 'Seek covered areas' },
        { month: 'September', avgTemp: 70, avgHumidity: 70, rainChance: 28, typicalConditions: 'Cooling down', shadeTip: 'Ideal weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Glass City Grille', perks: ['Restaurant seating', 'Climate controlled', 'Full service'], access: 'Restaurant entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'The Roost', description: 'Left field group area', capacity: 250 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Upper reserved'],
      familySections: ['Family areas', 'The Roost for groups'],
      tips: [
        { section: 'Glass City Grille', tip: 'Full dining with game view', category: 'experience' },
        { section: 'Upper deck', tip: 'Best shade and value', category: 'value' },
        { section: 'The Roost', tip: 'Perfect for groups', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: [
        'Tony Packo\'s hot dogs',
        'Packos chili mac',
        'Toledo favorites',
        'Glass City specialties'
      ],
      local: [
        'Northwest Ohio cuisine',
        'Local craft beers',
        'Regional favorites'
      ],
      alcohol: {
        beer: ['Great Lakes Brewing', 'Local craft selections', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '5-10 minutes', price: 'Varies', shadedSpots: true, covered: true }
      ],
      streetParking: { available: true, restrictions: 'Metered downtown' },
      alternativeTransport: {
        publicTransit: ['TARTA bus system'],
        rideShare: 'Downtown pickup points'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Washington Street', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Mud Hens gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Tony Packo\'s', description: 'Must-try famous hot dogs', category: 'food' },
        { title: 'Riverfront', description: 'Enjoy river views', category: 'experience' },
        { title: 'Downtown', description: 'Explore warehouse district', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 6:05 PM (Saturday), 2:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Warehouse District',
      description: 'Located in Toledo\'s revitalized warehouse district along the Maumee River.',
      beforeGame: ['Hensville restaurants', 'Downtown Toledo dining'],
      afterGame: ['Warehouse District bars', 'Downtown nightlife'],
      radius: 'Walking distance to downtown'
    },
    
    transportation: {
      address: '406 Washington Street, Toledo, OH 43604',
      publicTransit: {
        bus: [{ routes: ['TARTA routes'], stops: ['Downtown stops'] }]
      },
      driving: {
        majorRoutes: ['I-75', 'I-475', 'US-23'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-75 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Washington Street',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light'
      }
    },
    
    history: {
      timeline: [
        { year: 2002, event: 'Stadium opens' },
        { year: 2002, event: 'Replaces historic Ned Skeldon Stadium' }
      ],
      traditions: [
        { name: 'Tony Packo\'s', description: 'Famous hot dog tradition since 1932' },
        { name: 'Muddy the Mud Hen', description: 'Team mascot' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Riverfront charm with historic Toledo baseball tradition',
      bestExperiences: ['Tony Packo\'s hot dogs', 'River views', 'Glass City Grille dining'],
      traditions: ['Mud Hens heritage', 'Tony Packo\'s tradition'],
      mascot: { name: 'Muddy', description: 'The Mud Hen mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Tony Packo\'s line gets long',
        'Glass City Grille books up',
        'Riverfront breeze helps heat',
        'The Roost great for groups'
      ],
      avoidThese: ['Right field in afternoon', 'Late arrival for Packo\'s'],
      hiddenGems: ['Warehouse district bars', 'River walk'],
      photoSpots: ['River views', 'Downtown skyline', 'Warehouse architecture'],
      bestValue: ['Upper deck', 'Weekday specials', 'The Roost groups']
    }
  },

  'worcester-red-sox': {
    id: 'worcester-red-sox',
    name: 'Polar Park',
    team: 'Worcester Red Sox',
    opened: 2021,
    capacity: 9508,
    
    overview: {
      description: 'Polar Park is the newest Triple-A ballpark, opening in 2021 in Worcester\'s Canal District, featuring a replica Green Monster and modern amenities.',
      highlights: [
        'Newest Triple-A park (2021)',
        'Green Monster replica',
        'Canal District location',
        'Red Sox Triple-A affiliate'
      ],
      uniqueFeatures: [
        'Little Fenway with Green Monster',
        'Worcester Wall of Fame',
        'DCU Club restaurant',
        'Sustainable design features'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Third base side', 'DCU Club'],
        afternoon: ['DCU Club level', 'Upper deck overhang', 'Third base sections'],
        evening: ['Most sections shaded', 'Green Monster seats', 'First base cooler']
      },
      coveredSeating: ['DCU Club', 'Upper deck overhang', 'Suite level'],
      shadeTips: [
        'Upper deck provides coverage',
        'Third base side for afternoon',
        'DCU Club climate controlled',
        'New England weather varies'
      ],
      sunProtection: {
        shadedConcourses: ['Wide concourses'],
        indoorAreas: ['DCU Club', 'Suites', 'Team Store']
      },
      worstSunExposure: ['Field level seats', 'Right field afternoon', 'Green Monster seats early'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 62, rainChance: 32, typicalConditions: 'Cool spring', shadeTip: 'Sun often welcome' },
        { month: 'May', avgTemp: 63, avgHumidity: 64, rainChance: 32, typicalConditions: 'Variable', shadeTip: 'Layers recommended' },
        { month: 'June', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Shade for afternoon' },
        { month: 'July', avgTemp: 78, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm summer', shadeTip: 'Upper deck best' },
        { month: 'August', avgTemp: 76, avgHumidity: 72, rainChance: 28, typicalConditions: 'Warm and humid', shadeTip: 'DCU Club ideal' },
        { month: 'September', avgTemp: 68, avgHumidity: 70, rainChance: 30, typicalConditions: 'Fall baseball', shadeTip: 'Perfect weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'DCU Club', perks: ['Restaurant seating', 'Climate controlled', 'Exclusive menu'], access: 'DCU entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites', 'Party Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering', 'TVs']
        },
        specialAreas: [
          { name: 'Green Monster Seats', description: 'Atop the left field wall', capacity: 60 }
        ]
      },
      budgetOptions: ['Standing room', 'Upper reserved', 'Outfield seats'],
      familySections: ['Family areas', 'Kids zone nearby'],
      tips: [
        { section: 'Green Monster', tip: 'Unique experience like Fenway', category: 'experience' },
        { section: 'DCU Club', tip: 'Best amenities and comfort', category: 'shade' },
        { section: 'Upper deck', tip: 'Great value with coverage', category: 'value' }
      ]
    },
    
    concessions: {
      signature: [
        'Table Talk Pies',
        'Coney Island hot dogs',
        'New England clam chowder',
        'Wachusett Brewing beers'
      ],
      local: [
        'Worcester specialties',
        'Massachusetts craft beers',
        'New England favorites'
      ],
      alcohol: {
        beer: ['Wachusett Brewing', 'Sam Adams', 'Local craft selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['Wachusett', 'Wormtown', 'Greater Good']
      }
    },
    
    parking: {
      lots: [
        { name: 'Green Island Garage', distance: '2 minutes', price: '$10-15', shadedSpots: true, covered: true },
        { name: 'Canal District Lots', distance: '5-10 minutes', price: '$5-10', shadedSpots: false, covered: false }
      ],
      streetParking: { available: true, restrictions: 'Limited and metered' },
      alternativeTransport: {
        publicTransit: ['WRTA bus system', 'Commuter rail nearby'],
        rideShare: 'Canal District pickup points'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Summit Street', bestFor: ['All sections'], openTime: '90 minutes before' },
      { name: 'Plymouth Street Gate', location: 'Plymouth Street', bestFor: ['Left field'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['WooSox gear', 'Red Sox items'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      wifi: { available: true, freeZones: ['Throughout park'] }
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['All levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces in garage'
    },
    
    gameDay: {
      tips: [
        { title: 'New Park', description: 'Modern amenities throughout', category: 'experience' },
        { title: 'Green Monster', description: 'Book early for unique seats', category: 'experience' },
        { title: 'Canal District', description: 'Explore before/after game', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:45 PM (weekdays), 4:05 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Clear bag policy',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Large bags'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    
    neighborhood: {
      name: 'Canal District',
      description: 'Located in Worcester\'s revitalized Canal District with restaurants and entertainment.',
      beforeGame: ['Canal District restaurants', 'Shrewsbury Street dining'],
      afterGame: ['Canal District bars', 'Downtown Worcester'],
      radius: 'Walking distance to dining'
    },
    
    transportation: {
      address: '2 Summit Street, Worcester, MA 01608',
      publicTransit: {
        bus: [{ routes: ['WRTA routes'], stops: ['Polar Park'] }],
        train: [{ lines: ['Commuter Rail'], station: 'Union Station', walkTime: '15 minutes' }]
      },
      driving: {
        majorRoutes: ['I-290', 'Route 146', 'I-90'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'I-290 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Summit Street',
        dropoffZone: 'Main entrance',
        surgePricing: 'Moderate after games'
      }
    },
    
    history: {
      timeline: [
        { year: 2021, event: 'Stadium opens' },
        { year: 2021, event: 'PawSox relocate from Pawtucket' }
      ],
      traditions: [
        { name: 'Red Sox Heritage', description: 'Triple-A tradition continues' },
        { name: 'Smiley Ball', description: 'Logo and mascot theme' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'New England baseball in modern setting with Red Sox connection',
      bestExperiences: ['Green Monster seats', 'DCU Club dining', 'Canal District scene'],
      traditions: ['Red Sox pipeline', 'Worcester pride'],
      mascot: { name: 'Woofster', description: 'WooSox mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Newest park with all modern amenities',
        'Green Monster books quickly',
        'Canal District great for pre-game',
        'Garage parking worth it'
      ],
      avoidThese: ['Street parking hassles', 'Right field afternoon sun'],
      hiddenGems: ['DCU Club experience', 'Canal District scene'],
      photoSpots: ['Green Monster', 'Canal views', 'Modern architecture'],
      bestValue: ['Standing room', 'Upper deck', 'Weekday games']
    }
  },

  'albuquerque-isotopes': {
    id: 'albuquerque-isotopes',
    name: 'Isotopes Park',
    team: 'Albuquerque Isotopes',
    opened: 2003,
    capacity: 13279,
    
    overview: {
      description: 'Isotopes Park sits at 5,100 feet elevation in the high desert, featuring stunning Sandia Mountain views and a Simpsons-inspired team name.',
      highlights: [
        'Highest elevation in Triple-A',
        'Sandia Mountain views',
        'Simpsons connection',
        'High desert setting'
      ],
      uniqueFeatures: [
        '5,100 feet elevation',
        'Baseballs fly 10% farther',
        'Sandia Mountains backdrop',
        'New Mexico culture'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Third base side', 'Suite level'],
        afternoon: ['Club level', 'Upper deck overhang', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Berm area']
      },
      coveredSeating: ['Club level', 'Suite boxes', 'Upper deck overhang'],
      shadeTips: [
        'High altitude sun is intense',
        'Sunscreen essential at elevation',
        'Third base side for afternoon',
        'Dry desert air dehydrates quickly'
      ],
      sunProtection: {
        sunscreenStations: ['Guest services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club level', 'Suites', 'Team store']
      },
      worstSunExposure: ['Berm area', 'Right field seats', 'Field level afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 25, rainChance: 5, typicalConditions: 'Dry and mild', shadeTip: 'UV strong at altitude' },
        { month: 'May', avgTemp: 78, avgHumidity: 20, rainChance: 5, typicalConditions: 'Warming up', shadeTip: 'Shade becomes essential' },
        { month: 'June', avgTemp: 88, avgHumidity: 18, rainChance: 8, typicalConditions: 'Hot and dry', shadeTip: 'Seek covered areas' },
        { month: 'July', avgTemp: 92, avgHumidity: 30, rainChance: 25, typicalConditions: 'Monsoon season', shadeTip: 'Afternoon storms possible' },
        { month: 'August', avgTemp: 89, avgHumidity: 35, rainChance: 30, typicalConditions: 'Monsoons continue', shadeTip: 'Evening games cooler' },
        { month: 'September', avgTemp: 81, avgHumidity: 30, rainChance: 15, typicalConditions: 'Still warm', shadeTip: 'Perfect evening weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Coors Light Strike Zone', perks: ['All-inclusive', 'Climate controlled'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites', 'Party Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Berm', description: 'Grass hill in outfield', capacity: 500 }
        ]
      },
      budgetOptions: ['Berm seating', 'Upper reserved', 'General admission'],
      familySections: ['Family areas', 'Berm perfect for kids'],
      tips: [
        { section: 'Upper deck', tip: 'Best shade and mountain views', category: 'shade' },
        { section: 'Berm', tip: 'Bring blankets but no shade', category: 'value' },
        { section: 'Club level', tip: 'AC and all-inclusive', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: [
        'Green chile cheeseburgers',
        'Breakfast burritos',
        'Navajo tacos',
        'Local New Mexican cuisine'
      ],
      local: [
        'Hatch green chile everything',
        'Santa Fe Brewing',
        'La Cumbre Brewing',
        'Southwestern specialties'
      ],
      alcohol: {
        beer: ['Santa Fe Brewing', 'La Cumbre', 'Marble Brewery', 'Local craft selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['Santa Fe', 'La Cumbre', 'Marble', 'Bosque']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: '2-5 minutes', price: '$8-10', shadedSpots: false, covered: false },
        { name: 'Overflow Lots', distance: '5-10 minutes', price: '$5-8', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['ABQ RIDE bus system'],
        rideShare: 'Designated pickup areas'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'The Boulevard', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Isotopes gear', 'Simpsons items'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Suite and club levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces in main lot'
    },
    
    gameDay: {
      tips: [
        { title: 'High Altitude', description: 'Hydrate and use sunscreen', category: 'weather' },
        { title: 'Green Chile', description: 'Try on everything', category: 'food' },
        { title: 'Ball Flies', description: 'Expect more home runs', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:35 PM (weekdays), 6:05 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Journal Center',
      description: 'Located in the Journal Center area with mountain views and high desert landscape.',
      beforeGame: ['Local New Mexican restaurants', 'Breweries nearby'],
      afterGame: ['Uptown Albuquerque', 'Old Town (10 minutes)'],
      radius: '2-5 miles to dining'
    },
    
    transportation: {
      address: '1601 Avenida Cesar Chavez SE, Albuquerque, NM 87106',
      publicTransit: {
        bus: [{ routes: ['ABQ RIDE routes'], stops: ['Isotopes Park'] }]
      },
      driving: {
        majorRoutes: ['I-25', 'I-40', 'Cesar Chavez Ave'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-25 to Cesar Chavez exit'
      },
      rideShare: {
        pickupZone: 'Main entrance area',
        dropoffZone: 'Main gate',
        surgePricing: 'Light'
      }
    },
    
    history: {
      timeline: [
        { year: 2003, event: 'Stadium opens' },
        { year: 2003, event: 'Named after Simpsons episode' }
      ],
      traditions: [
        { name: 'Homer Simpson', description: 'Team name from TV episode' },
        { name: 'Green Chile', description: 'On everything at concessions' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'High desert baseball with New Mexican flair and mountain views',
      bestExperiences: ['Mountain sunset views', 'Green chile everything', 'High altitude homers'],
      traditions: ['Simpsons references', 'New Mexico pride'],
      mascot: { name: 'Orbit', description: 'Alien mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Hydrate constantly at altitude',
        'Sunscreen is essential',
        'Green chile on everything',
        'Balls fly - sit in outfield carefully',
        'Evening games much cooler'
      ],
      avoidThese: ['Berm without shade', 'Forgetting water', 'Underestimating sun'],
      hiddenGems: ['Mountain views at sunset', 'Local brewery selections'],
      photoSpots: ['Sandia Mountains backdrop', 'Desert sunset'],
      bestValue: ['Berm seating', 'Upper deck', 'Weekday specials']
    }
  },

  'el-paso-chihuahuas': {
    id: 'el-paso-chihuahuas',
    name: 'Southwest University Park',
    team: 'El Paso Chihuahuas',
    opened: 2014,
    capacity: 9500,
    
    overview: {
      description: 'Southwest University Park sits in downtown El Paso with views of Mexico and the Franklin Mountains, offering a unique border city baseball experience.',
      highlights: [
        'Downtown El Paso location',
        'Views of Juarez, Mexico',
        'Franklin Mountains backdrop',
        'Border city atmosphere'
      ],
      uniqueFeatures: [
        'International border views',
        'Desert mountain setting',
        'Modern downtown facility',
        'Bilingual atmosphere'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper level sections', 'Third base side', 'Suite level'],
        afternoon: ['WestStar Club', 'Upper deck overhang', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Party deck']
      },
      coveredSeating: ['WestStar Club', 'Suites', 'Upper deck overhang'],
      shadeTips: [
        'Desert sun is intense',
        'Shade essential for day games',
        'Third base side best',
        'Dry heat dehydrates quickly'
      ],
      sunProtection: {
        sunscreenStations: ['Guest services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['WestStar Club', 'Suites', 'Team store']
      },
      worstSunExposure: ['Right field seats', 'Field level afternoon', 'Party deck early'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 75, avgHumidity: 20, rainChance: 3, typicalConditions: 'Warm and dry', shadeTip: 'Shade recommended' },
        { month: 'May', avgTemp: 84, avgHumidity: 18, rainChance: 5, typicalConditions: 'Hot and dry', shadeTip: 'Shade essential' },
        { month: 'June', avgTemp: 93, avgHumidity: 20, rainChance: 8, typicalConditions: 'Very hot', shadeTip: 'Evening games better' },
        { month: 'July', avgTemp: 94, avgHumidity: 35, rainChance: 35, typicalConditions: 'Monsoon season', shadeTip: 'Afternoon storms possible' },
        { month: 'August', avgTemp: 92, avgHumidity: 38, rainChance: 35, typicalConditions: 'Monsoons continue', shadeTip: 'Storms bring relief' },
        { month: 'September', avgTemp: 86, avgHumidity: 35, rainChance: 20, typicalConditions: 'Still hot', shadeTip: 'Evening games ideal' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'WestStar Club', perks: ['All-inclusive', 'AC lounge', 'Premium dining'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Right field party area', capacity: 150 }
        ]
      },
      budgetOptions: ['Upper reserved', 'General admission', 'Standing room'],
      familySections: ['Family areas', 'Kids zone nearby'],
      tips: [
        { section: 'WestStar Club', tip: 'AC and all-inclusive worth it', category: 'shade' },
        { section: 'Upper deck', tip: 'Best shade and mountain views', category: 'value' },
        { section: 'Third base side', tip: 'Shade comes first', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: [
        'Chico\'s Tacos',
        'Street tacos',
        'Elote (Mexican street corn)',
        'Border cuisine'
      ],
      local: [
        'El Paso specialties',
        'Mexican favorites',
        'Local craft beers',
        'Margaritas'
      ],
      alcohol: {
        beer: ['DeadBeach Brewery', 'Local Mexican beers', 'Craft selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['DeadBeach', 'Blazing Tree']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '5-10 minutes', price: '$5-8', shadedSpots: true, covered: true }
      ],
      streetParking: { available: true, restrictions: 'Limited downtown' },
      alternativeTransport: {
        publicTransit: ['Sun Metro bus system', 'Streetcar nearby'],
        rideShare: 'Downtown pickup points'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Durango Street', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Chihuahuas gear', 'Border-themed items'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['All levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Desert Heat', description: 'Hydrate and shade essential', category: 'weather' },
        { title: 'Border Views', description: 'See two countries', category: 'experience' },
        { title: 'Local Food', description: 'Try Chico\'s Tacos', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 7:05 PM (Saturday), 6:35 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown El Paso',
      description: 'Located in revitalized downtown El Paso near the border and university.',
      beforeGame: ['Downtown restaurants', 'Mexican cuisine everywhere'],
      afterGame: ['Downtown bars', 'Cincinnati Entertainment District'],
      radius: 'Walking distance downtown'
    },
    
    transportation: {
      address: '1 Ballpark Plaza, El Paso, TX 79901',
      publicTransit: {
        bus: [{ routes: ['Sun Metro routes'], stops: ['Downtown'] }]
      },
      driving: {
        majorRoutes: ['I-10', 'US-54', 'Border Highway'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-10 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Durango Street',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light'
      }
    },
    
    history: {
      timeline: [
        { year: 2014, event: 'Stadium opens' },
        { year: 2014, event: 'Revitalizes downtown El Paso' }
      ],
      traditions: [
        { name: 'Chihuahua Racing', description: 'Between-inning entertainment' },
        { name: 'Border Culture', description: 'Bilingual atmosphere' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Border city baseball with international flavor and desert beauty',
      bestExperiences: ['Mexico views', 'Mountain sunsets', 'Local cuisine'],
      traditions: ['Chihuahua races', 'Border pride'],
      mascot: { name: 'Chico', description: 'Chihuahua mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Desert heat is intense',
        'WestStar Club worth it for heat',
        'Try local Mexican food',
        'Sunset views are spectacular'
      ],
      avoidThese: ['Right field in afternoon', 'Forgetting sunscreen'],
      hiddenGems: ['Border views', 'Mountain sunsets', 'Downtown scene'],
      photoSpots: ['Franklin Mountains', 'Mexico views', 'Desert sunset'],
      bestValue: ['Upper deck', 'Weekday games', 'Group areas']
    }
  },

  'oklahoma-city-dodgers': {
    id: 'oklahoma-city-dodgers',
    name: 'Chickasaw Bricktown Ballpark',
    team: 'Oklahoma City Dodgers',
    opened: 1998,
    capacity: 13066,
    
    overview: {
      description: 'Chickasaw Bricktown Ballpark anchors Oklahoma City\'s entertainment district, featuring extensive covered seating and classic brick architecture.',
      highlights: [
        'Bricktown entertainment district',
        'Extensive covered seating',
        'Downtown OKC location',
        'Dodgers Triple-A affiliate'
      ],
      uniqueFeatures: [
        'Brick warehouse design',
        'Bricktown canal nearby',
        'Large upper deck coverage',
        'Urban ballpark setting'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Third base side', 'Club level'],
        afternoon: ['Covered upper deck', 'Club seats', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Outfield areas']
      },
      coveredSeating: ['Extensive upper deck coverage', 'Club level', 'Suites'],
      shadeTips: [
        'Upper deck has best coverage',
        'Oklahoma heat requires shade',
        'Third base side for afternoon',
        'Covered areas essential summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club level', 'Suites', 'Team store']
      },
      worstSunExposure: ['Field level seats', 'Right field bleachers', 'First base afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 65, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable spring', shadeTip: 'Weather changes quickly' },
        { month: 'May', avgTemp: 74, avgHumidity: 68, rainChance: 35, typicalConditions: 'Storm season', shadeTip: 'Watch for storms' },
        { month: 'June', avgTemp: 82, avgHumidity: 68, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
        { month: 'July', avgTemp: 88, avgHumidity: 65, rainChance: 20, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck best' },
        { month: 'August', avgTemp: 87, avgHumidity: 65, rainChance: 25, typicalConditions: 'Still very hot', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 78, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'More comfortable' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Club Level', perks: ['Indoor/outdoor seating', 'AC access', 'Premium concessions'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        }
      },
      budgetOptions: ['Upper deck', 'Outfield seats', 'General admission'],
      familySections: ['Family areas', 'Kids zone nearby'],
      tips: [
        { section: 'Upper deck', tip: 'Best coverage from sun/rain', category: 'shade' },
        { section: 'Club level', tip: 'AC access worth it summer', category: 'shade' },
        { section: 'Third base side', tip: 'Gets shade first', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: [
        'Oklahoma BBQ',
        'Chicken fried steak sandwich',
        'Local craft beers',
        'Regional favorites'
      ],
      local: [
        'Oklahoma specialties',
        'BBQ varieties',
        'COOP Ale Works',
        'Prairie Artisan Ales'
      ],
      alcohol: {
        beer: ['COOP Ale Works', 'Prairie', 'Anthem Brewing', 'Local craft selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['COOP', 'Prairie', 'Anthem', 'Stonecloud']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Bricktown Garages', distance: '5-10 minutes', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: { available: true, restrictions: 'Limited in Bricktown' },
      alternativeTransport: {
        publicTransit: ['OKC Streetcar', 'EMBARK bus system'],
        rideShare: 'Bricktown pickup points'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Mickey Mantle Drive', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['OKC Dodgers gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['All levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Bricktown', description: 'Explore before/after game', category: 'experience' },
        { title: 'Upper Deck', description: 'Best coverage from elements', category: 'shade' },
        { title: 'Streetcar', description: 'Easy transportation', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 7:05 PM (Saturday), 2:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Bricktown',
      description: 'Located in Oklahoma City\'s premier entertainment district with restaurants, bars, and canal.',
      beforeGame: ['Bricktown restaurants', 'Canal walk', 'Brewery district'],
      afterGame: ['Bricktown nightlife', 'Canal boat rides'],
      radius: 'Walking distance to everything'
    },
    
    transportation: {
      address: '2 South Mickey Mantle Drive, Oklahoma City, OK 73104',
      publicTransit: {
        train: [{ lines: ['OKC Streetcar'], station: 'Bricktown', walkTime: '2 minutes' }],
        bus: [{ routes: ['EMBARK routes'], stops: ['Bricktown'] }]
      },
      driving: {
        majorRoutes: ['I-40', 'I-35', 'I-235'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'I-40 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Bricktown area',
        dropoffZone: 'Main entrance',
        surgePricing: 'Moderate after games'
      }
    },
    
    history: {
      timeline: [
        { year: 1998, event: 'Stadium opens' },
        { year: 1998, event: 'Anchors Bricktown development' }
      ],
      traditions: [
        { name: 'Mickey Mantle Legacy', description: 'Oklahoma native honored' },
        { name: 'Dodgers Pipeline', description: 'LA connection' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Urban ballpark in entertainment district with Dodgers connection',
      bestExperiences: ['Bricktown scene', 'Covered seating comfort', 'Local BBQ'],
      traditions: ['Dodgers heritage', 'Oklahoma pride']
    },
    
    proTips: {
      insiderTips: [
        'Upper deck has great coverage',
        'Bricktown before/after is fun',
        'Streetcar makes arrival easy',
        'Club level AC worth it summer'
      ],
      avoidThese: ['Field level in summer heat', 'Driving if streetcar available'],
      hiddenGems: ['Bricktown canal walk', 'Local brewery scene'],
      photoSpots: ['Bricktown backdrop', 'Brick architecture'],
      bestValue: ['Upper deck covered seats', 'Streetcar transport']
    }
  },

  'reno-aces': {
    id: 'reno-aces',
    name: 'Greater Nevada Field',
    team: 'Reno Aces',
    opened: 2009,
    capacity: 9013,
    
    overview: {
      description: 'Greater Nevada Field sits in downtown Reno at 4,500 feet elevation, offering Sierra Nevada mountain views and a "Biggest Little City" atmosphere.',
      highlights: [
        'Downtown Reno location',
        'Sierra Nevada views',
        '4,500 feet elevation',
        'Freight House District nearby'
      ],
      uniqueFeatures: [
        'High altitude baseball',
        'Mountain backdrop',
        'Aces Pool',
        'Downtown casino proximity'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Third base side', 'Club level'],
        afternoon: ['Club seats', 'Upper deck overhang', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Pool area']
      },
      coveredSeating: ['Club level', 'Suites', 'Upper deck overhang'],
      shadeTips: [
        'High altitude sun intense',
        'Dry desert air dehydrates',
        'Third base side best',
        'Mountain shadows help evening'
      ],
      sunProtection: {
        sunscreenStations: ['Guest services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club level', 'Suites', 'Freight House Bar']
      },
      worstSunExposure: ['Pool area', 'Right field seats', 'Field level afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 35, rainChance: 10, typicalConditions: 'Cool and dry', shadeTip: 'Variable weather' },
        { month: 'May', avgTemp: 68, avgHumidity: 30, rainChance: 8, typicalConditions: 'Pleasant', shadeTip: 'Perfect conditions' },
        { month: 'June', avgTemp: 78, avgHumidity: 25, rainChance: 5, typicalConditions: 'Warm and dry', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 88, avgHumidity: 20, rainChance: 3, typicalConditions: 'Hot and dry', shadeTip: 'Shade essential' },
        { month: 'August', avgTemp: 86, avgHumidity: 22, rainChance: 5, typicalConditions: 'Still hot', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 76, avgHumidity: 28, rainChance: 5, typicalConditions: 'Cooling down', shadeTip: 'Ideal weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'SK Baseball Club', perks: ['All-inclusive', 'Climate controlled'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Aces Pool', description: 'Pool beyond right field', capacity: 100 }
        ]
      },
      budgetOptions: ['General admission', 'Upper deck', 'Outfield seats'],
      familySections: ['Family areas', 'Kids zone'],
      tips: [
        { section: 'Upper deck', tip: 'Best mountain views and shade', category: 'shade' },
        { section: 'Pool area', tip: 'Unique but hot during day', category: 'experience' },
        { section: 'Third base side', tip: 'Shade and Sierra views', category: 'view' }
      ]
    },
    
    concessions: {
      signature: [
        'Awful Awful Burger',
        'BBQ nachos',
        'Local craft beers',
        'Casino-style fare'
      ],
      local: [
        'Nevada specialties',
        'Great Basin Brewing',
        'IMBIB Custom Brews',
        'Regional favorites'
      ],
      alcohol: {
        beer: ['Great Basin', 'IMBIB', 'Revision Brewing', 'Local craft selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['Great Basin', 'IMBIB', 'Revision']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$7-10', shadedSpots: false, covered: false },
        { name: 'Casino Garages', distance: '5-10 minutes', price: 'Free-$5', shadedSpots: true, covered: true }
      ],
      streetParking: { available: true, restrictions: 'Downtown meters' },
      alternativeTransport: {
        publicTransit: ['RTC bus system'],
        rideShare: 'Downtown pickup points'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'East 2nd Street', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Aces gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['All levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'High Altitude', description: 'Hydrate frequently', category: 'weather' },
        { title: 'Casino Parking', description: 'Often free or cheap', category: 'arrival' },
        { title: 'Freight House', description: 'Great pre-game spot', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:35 PM (weekdays), 6:35 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Reno',
      description: 'Located in downtown Reno near casinos, Freight House District, and river walk.',
      beforeGame: ['Freight House District', 'Downtown casinos', 'River walk'],
      afterGame: ['Casino entertainment', 'Downtown nightlife'],
      radius: 'Walking distance downtown'
    },
    
    transportation: {
      address: '250 Evans Avenue, Reno, NV 89501',
      publicTransit: {
        bus: [{ routes: ['RTC routes'], stops: ['Downtown'] }]
      },
      driving: {
        majorRoutes: ['I-80', 'US-395', 'I-580'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-80 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Evans Avenue',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light'
      }
    },
    
    history: {
      timeline: [
        { year: 2009, event: 'Stadium opens' },
        { year: 2009, event: 'Diamondbacks affiliate begins' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'High desert baseball with casino town energy and mountain beauty',
      bestExperiences: ['Pool party', 'Mountain views', 'Freight House scene'],
      traditions: ['Aces branding', 'Biggest Little City pride']
    },
    
    proTips: {
      insiderTips: [
        'Casino garages often cheaper',
        'Freight House great pre-game',
        'High altitude affects ball flight',
        'Pool unique but hot'
      ],
      avoidThese: ['Pool area midday', 'Field level afternoon'],
      hiddenGems: ['Mountain sunset views', 'Freight House District'],
      photoSpots: ['Sierra Nevada backdrop', 'Downtown skyline'],
      bestValue: ['Casino parking', 'Upper deck seats']
    }
  },

  'round-rock-express': {
    id: 'round-rock-express',
    name: 'Dell Diamond',
    team: 'Round Rock Express',
    opened: 2000,
    capacity: 11631,
    
    overview: {
      description: 'Dell Diamond in Round Rock serves as one of Triple-A\'s premier facilities, featuring Texas-sized amenities and a strong Rangers connection.',
      highlights: [
        'Premier Triple-A facility',
        'Texas Rangers affiliate',
        'Swimming pool in outfield',
        'Austin suburb location'
      ],
      uniqueFeatures: [
        'Rock Porch pool area',
        'United Heritage Center',
        'Texas-sized videoboard',
        'Dell technology integration'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Third base side', 'Suite level'],
        afternoon: ['United Heritage Center', 'Upper deck overhang', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Pool area']
      },
      coveredSeating: ['United Heritage Center', 'Suites', 'Upper deck overhang'],
      shadeTips: [
        'Texas heat requires shade',
        'Third base side best',
        'Pool area hot during day',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['United Heritage Center', 'Suites', 'Team store']
      },
      worstSunExposure: ['Pool area', 'Right field seats', 'Field level afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 72, avgHumidity: 68, rainChance: 25, typicalConditions: 'Pleasant spring', shadeTip: 'Variable weather' },
        { month: 'May', avgTemp: 80, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warming up', shadeTip: 'Shade becoming important' },
        { month: 'June', avgTemp: 88, avgHumidity: 68, rainChance: 20, typicalConditions: 'Hot Texas summer', shadeTip: 'Shade essential' },
        { month: 'July', avgTemp: 93, avgHumidity: 65, rainChance: 15, typicalConditions: 'Peak heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 94, avgHumidity: 65, rainChance: 15, typicalConditions: 'Still very hot', shadeTip: 'Seek AC areas' },
        { month: 'September', avgTemp: 86, avgHumidity: 68, rainChance: 25, typicalConditions: 'Slightly cooler', shadeTip: 'Still need shade' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'United Heritage Center', perks: ['All-inclusive', 'AC lounge', 'Premium dining'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites', 'Party Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Rock Porch', description: 'Pool and party area', capacity: 200 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper deck', 'Outfield seats'],
      familySections: ['Family areas', 'Lawn perfect for kids'],
      tips: [
        { section: 'United Heritage Center', tip: 'AC and all-inclusive', category: 'shade' },
        { section: 'Lawn', tip: 'Bring blankets, great value', category: 'value' },
        { section: 'Rock Porch', tip: 'Pool party atmosphere', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: [
        'Texas BBQ',
        'Brisket nachos',
        'Chicken fried everything',
        'Local craft beers'
      ],
      local: [
        'Austin-area favorites',
        'Texas cuisine',
        'Local breweries',
        'Tex-Mex options'
      ],
      alcohol: {
        beer: ['Austin Beerworks', 'Independence Brewing', 'Local Texas beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Austin Beerworks', 'Independence', 'Zilker']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lots', distance: '2-5 minutes', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Premium Parking', distance: '1-2 minutes', price: '$15', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        rideShare: 'Designated pickup areas'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Nolan Ryan Expressway', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Express gear', 'Rangers items'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      kidZones: [{ name: 'Fun Zone', location: 'Left field', activities: ['Playground', 'Games'] }]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['All levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Texas Heat', description: 'Shade and hydration essential', category: 'weather' },
        { title: 'Pool Area', description: 'Book early for groups', category: 'experience' },
        { title: 'Rangers Rehabs', description: 'Check for MLB players', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:00 PM (weekdays), 7:00 PM (Saturday), 2:00 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Round Rock',
      description: 'Located in Round Rock, a growing Austin suburb with tech industry presence.',
      beforeGame: ['Round Rock restaurants', 'Old Town Round Rock'],
      afterGame: ['Downtown Round Rock', 'Austin nightlife (20 minutes)'],
      radius: '2-5 miles to dining'
    },
    
    transportation: {
      address: '3400 E Palm Valley Blvd, Round Rock, TX 78665',
      publicTransit: {},
      driving: {
        majorRoutes: ['I-35', 'Highway 79', 'Highway 45'],
        typicalTraffic: 'Moderate from Austin',
        bestApproach: 'I-35 to Highway 79 exit'
      },
      rideShare: {
        pickupZone: 'Designated areas',
        dropoffZone: 'Main entrance',
        surgePricing: 'Moderate'
      }
    },
    
    history: {
      timeline: [
        { year: 2000, event: 'Stadium opens' },
        { year: 2000, event: 'Named after Dell Inc.' },
        { year: 2011, event: 'Becomes Rangers affiliate' }
      ],
      traditions: [
        { name: 'Nolan Ryan Legacy', description: 'Team founder and Texas legend' },
        { name: 'Express Train', description: 'Team theme' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Texas-sized baseball experience with Rangers connection',
      bestExperiences: ['Rock Porch pool', 'Texas BBQ', 'Rangers rehab games'],
      traditions: ['Express train horn', 'Texas pride'],
      mascot: { name: 'Spike', description: 'Express train conductor' }
    },
    
    proTips: {
      insiderTips: [
        'Pool area books months ahead',
        'United Heritage Center worth it for heat',
        'Check for Rangers rehab starts',
        'Lawn seating great for families'
      ],
      avoidThese: ['Right field afternoon', 'Pool area midday heat'],
      hiddenGems: ['Old Town Round Rock', 'Austin scene nearby'],
      photoSpots: ['Pool area', 'Texas-sized scoreboard'],
      bestValue: ['Lawn seating', 'Upper deck', 'Weekday specials']
    }
  },

  'sugar-land-space-cowboys': {
    id: 'sugar-land-space-cowboys',
    name: 'Constellation Field',
    team: 'Sugar Land Space Cowboys',
    opened: 2012,
    capacity: 7500,
    
    overview: {
      description: 'Constellation Field in Sugar Land features a space theme as the Astros Triple-A affiliate, with modern amenities in Houston\'s suburbs.',
      highlights: [
        'Newest Astros affiliate (2021)',
        'Space-themed elements',
        'Houston suburb location',
        'Modern facility'
      ],
      uniqueFeatures: [
        'Space Cowboys branding',
        'Astros player development',
        'Sugar Land Town Square nearby',
        'Family-friendly design'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Third base side', 'Suite level'],
        afternoon: ['Club seats', 'Upper deck overhang', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Lawn area']
      },
      coveredSeating: ['Club level', 'Suites', 'Upper deck overhang'],
      shadeTips: [
        'Houston humidity intense',
        'Shade essential summer',
        'Third base side best',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club areas', 'Suites', 'Team store']
      },
      worstSunExposure: ['Lawn area', 'Right field seats', 'Field level afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 74, avgHumidity: 72, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Already getting hot' },
        { month: 'May', avgTemp: 81, avgHumidity: 74, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Shade important' },
        { month: 'June', avgTemp: 87, avgHumidity: 75, rainChance: 35, typicalConditions: 'Very hot and humid', shadeTip: 'Shade essential' },
        { month: 'July', avgTemp: 90, avgHumidity: 76, rainChance: 30, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 90, avgHumidity: 76, rainChance: 35, typicalConditions: 'Still very hot', shadeTip: 'Seek AC areas' },
        { month: 'September', avgTemp: 85, avgHumidity: 75, rainChance: 30, typicalConditions: 'Slightly cooler', shadeTip: 'Still need shade' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Constellation Club', perks: ['All-inclusive', 'AC access', 'Premium menu'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Grass berm seating', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper deck', 'Outfield seats'],
      familySections: ['Family areas', 'Lawn area'],
      tips: [
        { section: 'Constellation Club', tip: 'AC essential in summer', category: 'shade' },
        { section: 'Lawn', tip: 'Bring blankets, no shade', category: 'value' },
        { section: 'Upper deck', tip: 'Best shade coverage', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: [
        'Space-themed items',
        'Texas BBQ',
        'Houston favorites',
        'Local craft beers'
      ],
      local: [
        'Houston cuisine',
        'Tex-Mex options',
        'Gulf Coast seafood',
        'Texas breweries'
      ],
      alcohol: {
        beer: ['Saint Arnold', 'Karbach', 'Local Houston beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Saint Arnold', 'Karbach', '8th Wonder']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Town Square Garages', distance: '5-10 minutes', price: '$5', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        rideShare: 'Designated pickup areas'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Stadium Drive', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Space Cowboys gear', 'Astros items'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['All levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Houston Heat', description: 'Humidity makes it feel hotter', category: 'weather' },
        { title: 'Town Square', description: 'Dining and shopping nearby', category: 'experience' },
        { title: 'Astros Pipeline', description: 'Future MLB stars', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 7:05 PM (Saturday), 2:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Sugar Land',
      description: 'Located in Sugar Land, a Houston suburb with Town Square entertainment district.',
      beforeGame: ['Town Square restaurants', 'Local dining'],
      afterGame: ['Town Square nightlife', 'Houston options (30 minutes)'],
      radius: 'Walking distance to Town Square'
    },
    
    transportation: {
      address: '1 Stadium Drive, Sugar Land, TX 77498',
      publicTransit: {},
      driving: {
        majorRoutes: ['US-59', 'Highway 6', 'I-69'],
        typicalTraffic: 'Moderate from Houston',
        bestApproach: 'US-59 to University Blvd'
      },
      rideShare: {
        pickupZone: 'Stadium Drive',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light to moderate'
      }
    },
    
    history: {
      timeline: [
        { year: 2012, event: 'Stadium opens as Skeeters ballpark' },
        { year: 2021, event: 'Becomes Astros Triple-A affiliate' },
        { year: 2021, event: 'Rebranded as Space Cowboys' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly suburban ballpark with space theme and Astros connection',
      bestExperiences: ['Space theme fun', 'Astros prospects', 'Town Square scene'],
      traditions: ['Space Cowboys branding', 'Houston baseball heritage']
    },
    
    proTips: {
      insiderTips: [
        'Town Square great before/after',
        'Humidity makes heat worse',
        'Club level AC worth it summer',
        'Watch for Astros rehabs'
      ],
      avoidThese: ['Lawn midday', 'Right field afternoon'],
      hiddenGems: ['Town Square dining', 'Modern amenities'],
      photoSpots: ['Space-themed areas', 'Modern architecture'],
      bestValue: ['Lawn seating', 'Upper deck', 'Town Square parking']
    }
  },

  'tacoma-rainiers': {
    id: 'tacoma-rainiers',
    name: 'Cheney Stadium',
    team: 'Tacoma Rainiers',
    opened: 1960,
    capacity: 6500,
    
    overview: {
      description: 'Cheney Stadium is the oldest Triple-A ballpark, featuring classic Pacific Northwest charm with Mount Rainier views and recent renovations.',
      highlights: [
        'Oldest Triple-A park (1960)',
        'Mount Rainier views',
        'Recent $30M renovation',
        'Mariners Triple-A affiliate'
      ],
      uniqueFeatures: [
        'Historic ballpark charm',
        'Pacific Northwest setting',
        'Mount Rainier backdrop',
        'Puget Sound proximity'
      ],
      renovations: [
        { year: 2011, description: '$30 million renovation and modernization' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper sections', 'Third base side', 'Covered areas'],
        afternoon: ['Covered seating', 'Third base sections', 'Upper areas'],
        evening: ['Most sections shaded', 'First base cooler', 'Outfield areas']
      },
      coveredSeating: ['Limited covered areas', 'Some upper sections', 'Suite areas'],
      shadeTips: [
        'Pacific Northwest often cloudy',
        'Rain more concern than sun',
        'Mild temperatures typical',
        'Layers recommended'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Suites', 'Indoor concessions', 'Team store']
      },
      worstSunExposure: ['Right field seats', 'Field level on sunny days'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 56, avgHumidity: 72, rainChance: 45, typicalConditions: 'Cool and often wet', shadeTip: 'Rain gear important' },
        { month: 'May', avgTemp: 62, avgHumidity: 70, rainChance: 35, typicalConditions: 'Mild spring', shadeTip: 'Layers recommended' },
        { month: 'June', avgTemp: 67, avgHumidity: 68, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
        { month: 'July', avgTemp: 73, avgHumidity: 65, rainChance: 15, typicalConditions: 'Warm and dry', shadeTip: 'Rare hot days need shade' },
        { month: 'August', avgTemp: 73, avgHumidity: 66, rainChance: 20, typicalConditions: 'Peak summer', shadeTip: 'Most comfortable' },
        { month: 'September', avgTemp: 67, avgHumidity: 70, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Layers for evening' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        }
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Outfield seats'],
      familySections: ['Family areas', 'Kids zone nearby'],
      tips: [
        { section: 'Third base side', tip: 'Best for afternoon sun', category: 'shade' },
        { section: 'Behind home', tip: 'Classic ballpark views', category: 'view' },
        { section: 'Covered areas', tip: 'Protection from rain', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: [
        'Pacific Northwest seafood',
        'Ivar\'s fish and chips',
        'Local craft beers',
        'Regional favorites'
      ],
      local: [
        'Northwest cuisine',
        'Seattle-area favorites',
        'Local breweries',
        'Coffee selections'
      ],
      alcohol: {
        beer: ['Local Washington beers', 'Pacific Northwest craft selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['Harmon Brewing', 'Pacific Brewing']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$5-8', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['Pierce Transit bus system'],
        rideShare: 'Pickup areas available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Cheney Stadium Drive', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Rainiers gear', 'Mariners items'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Accessible seating throughout'],
        entrance: 'All gates accessible',
        elevators: ['Available for upper levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Northwest Weather', description: 'Bring layers and rain gear', category: 'weather' },
        { title: 'Mount Rainier', description: 'Look for mountain views', category: 'experience' },
        { title: 'Historic Park', description: 'Enjoy classic ballpark feel', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 6:05 PM (Saturday), 1:35 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'South Tacoma',
      description: 'Located in South Tacoma with views of Mount Rainier and Puget Sound proximity.',
      beforeGame: ['Local Tacoma restaurants', 'Freighthouse Square'],
      afterGame: ['Downtown Tacoma', 'Waterfront district'],
      radius: '5-10 minutes to dining'
    },
    
    transportation: {
      address: '2502 South Tyler Street, Tacoma, WA 98405',
      publicTransit: {
        bus: [{ routes: ['Pierce Transit routes'], stops: ['Stadium area'] }]
      },
      driving: {
        majorRoutes: ['I-5', 'Highway 16', 'I-705'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-5 to Highway 16 exit'
      },
      rideShare: {
        pickupZone: 'Tyler Street',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light'
      }
    },
    
    history: {
      timeline: [
        { year: 1960, event: 'Stadium opens' },
        { year: 1995, event: 'Becomes Mariners affiliate' },
        { year: 2011, event: '$30 million renovation completed' }
      ],
      traditions: [
        { name: 'Pacific Northwest Baseball', description: 'Long baseball tradition' },
        { name: 'Mariners Pipeline', description: 'Development of MLB talent' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Classic ballpark with Pacific Northwest charm and mountain views',
      bestExperiences: ['Mount Rainier views', 'Historic ballpark feel', 'Northwest seafood'],
      traditions: ['Rainiers heritage', 'Mariners connection'],
      mascot: { name: 'Rhubarb', description: 'Rainiers mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Bring layers for changing weather',
        'Rain gear often needed',
        'Mount Rainier visible on clear days',
        'Classic ballpark atmosphere'
      ],
      avoidThese: ['Forgetting rain jacket', 'Underdressing for evening'],
      hiddenGems: ['Mountain views', 'Historic charm', 'Local seafood'],
      photoSpots: ['Mount Rainier backdrop', 'Classic ballpark architecture'],
      bestValue: ['General admission', 'Weekday games']
    }
  }
};