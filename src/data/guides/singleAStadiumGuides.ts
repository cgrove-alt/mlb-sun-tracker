import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides: Record<string, StadiumGuide> = {
  'augusta-greenjackets': {
    id: 'augusta-greenjackets',
    name: 'SRP Park',
    team: 'Augusta GreenJackets',
    opened: 2018,
    capacity: 4782,
    overview: {
      description: 'SRP Park in North Augusta, South Carolina, is the home of the Augusta GreenJackets, Braves Single-A affiliate. This brand new facility features modern amenities with intimate seating for 4782 fans. ',
      highlights: [
        'Braves Single-A affiliate since 2018',
        'State-Of-The-Art facility',
        'North Augusta landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Auggie',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2028, description: 'Seating improvements' },
        { year: 2033, description: 'Concourse and concessions renovation' },
        { year: 2038, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Auggie team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['General admission', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 95 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '119',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'She-crab soup'],
      local: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
        cocktails: true,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike valet'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Augusta GreenJackets authentic gear', 'Auggie merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Auggies Playground',
          location: 'Left field corner',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Auggie', description: 'Green jacket character appears pregame', category: 'family' },
        { title: 'Try the Mustard BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'North Augusta area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4782 SRP Park, North Augusta, South Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2018, event: 'Stadium opens' },
        { year: 2019, event: 'Braves affiliation established' },
        { year: 2023, event: 'First championship' },
        { year: 2028, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Auggie race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Auggie', description: 'Green jacket character' },
      bestExperiences: ['Meeting Auggie', 'Fireworks shows', 'Trying Mustard BBQ', 'Theme nights'],
      traditions: ['Auggie antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Download the app for deals',
        'Best Mustard BBQ at Section 117',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Park entrance sign',
        'Standing room bar area',
        'Auggie meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Auggie at Kids zone',
        'Team logo at entrance',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Happy hour deals',
        'Flex plans'
      ]
    }
  },
  'charleston-riverdogs': {
    id: 'charleston-riverdogs',
    name: 'Joseph P. Riley Jr. Park',
    team: 'Charleston RiverDogs',
    opened: 1997,
    capacity: 6000,
    overview: {
      description: 'Joseph P. Riley Jr. Park in Charleston, South Carolina, is the home of the Charleston RiverDogs, Rays Single-A affiliate. This updated facility maintains its classic charm with a capacity of 6000 fans. ',
      highlights: [
        'Rays Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Charleston landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Charlie T. RiverDog',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Charlie T. RiverDog team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 120 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '150',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'She-crab soup'],
      local: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Charleston RiverDogs authentic gear', 'Charlie T. RiverDog merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Charlie T. RiverDogs Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Charlie T. RiverDog', description: 'Dog in baseball uniform appears pregame', category: 'family' },
        { title: 'Try the Mustard BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Charleston area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6000 Joseph P. Riley Jr. Park, Charleston, South Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1997, event: 'Stadium opens' },
        { year: 2000, event: 'Rays affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Charlie T. RiverDog race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Charlie T. RiverDog', description: 'Dog in baseball uniform' },
      bestExperiences: ['Meeting Charlie T. RiverDog', 'Fireworks shows', 'Trying Mustard BBQ', 'Theme nights'],
      traditions: ['Charlie T. RiverDog antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Mustard BBQ at Section 119',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Charlie T. RiverDog meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Charlie T. RiverDog at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'columbia-fireflies': {
    id: 'columbia-fireflies',
    name: 'Segra Park',
    team: 'Columbia Fireflies',
    opened: 2016,
    capacity: 9077,
    overview: {
      description: 'Segra Park in Columbia, South Carolina, is the home of the Columbia Fireflies, Royals Single-A affiliate. This brand new facility features modern amenities with a capacity of 9077 fans. ',
      highlights: [
        'Royals Single-A affiliate since 2016',
        'State-Of-The-Art facility',
        'Columbia landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Mason',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2026, description: 'Seating improvements' },
        { year: 2031, description: 'Concourse and concessions renovation' },
        { year: 2036, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Club level'],
        indoorAreas: ['Mason team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 181 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '226',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'She-crab soup'],
      local: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'General Parking', distance: '200 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Columbia Fireflies authentic gear', 'Mason merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['All restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Masons Playground',
          location: 'Beyond outfield',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Mason', description: 'Firefly appears pregame', category: 'family' },
        { title: 'Try the Mustard BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Columbia area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '9077 Segra Park, Columbia, South Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2016, event: 'Stadium opens' },
        { year: 2017, event: 'Royals affiliation established' },
        { year: 2021, event: 'First championship' },
        { year: 2026, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Mason race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Mason', description: 'Firefly' },
      bestExperiences: ['Meeting Mason', 'Fireworks shows', 'Trying Mustard BBQ', 'Theme nights'],
      traditions: ['Mason antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Download the app for deals',
        'Best Mustard BBQ at Section 119',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Park entrance sign',
        'Standing room bar area',
        'Mason meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Mason at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Happy hour deals',
        'Flex plans'
      ]
    }
  },
  'carolina-mudcats': {
    id: 'carolina-mudcats',
    name: 'Five County Stadium',
    team: 'Carolina Mudcats',
    opened: 1991,
    capacity: 6500,
    overview: {
      description: 'Five County Stadium in Zebulon, North Carolina, is the home of the Carolina Mudcats, Brewers Single-A affiliate. This updated facility maintains its classic charm with a capacity of 6500 fans. ',
      highlights: [
        'Brewers Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Zebulon landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Muddy',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Muddy team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 130 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '162',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Carolina Mudcats authentic gear', 'Muddy merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Muddys Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Muddy', description: 'Catfish appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Zebulon area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6500 Five County Stadium, Zebulon, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1991, event: 'Stadium opens' },
        { year: 2000, event: 'Brewers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Muddy race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Muddy', description: 'Catfish' },
      bestExperiences: ['Meeting Muddy', 'Fireworks shows', 'Trying Carolina BBQ', 'Theme nights'],
      traditions: ['Muddy antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Carolina BBQ at Section 119',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Muddy meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Muddy at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'delmarva-shorebirds': {
    id: 'delmarva-shorebirds',
    name: 'Arthur W. Perdue Stadium',
    team: 'Delmarva Shorebirds',
    opened: 1996,
    capacity: 5200,
    overview: {
      description: 'Arthur W. Perdue Stadium in Salisbury, Maryland, is the home of the Delmarva Shorebirds, Orioles Single-A affiliate. This updated facility maintains its classic charm with a capacity of 5200 fans. ',
      highlights: [
        'Orioles Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Salisbury landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Sherman',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Sherman team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 104 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '130',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Crab cakes', 'Old Bay fries', 'Pit beef sandwiches', 'Natty Boh beer'],
      local: ['Crab cakes', 'Old Bay fries', 'Pit beef sandwiches', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Flying Dog', 'Heavy Seas', 'Union Craft', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Flying Dog', 'Heavy Seas', 'Union Craft']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Delmarva Shorebirds authentic gear', 'Sherman merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Shermans Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Sherman', description: 'Orange shorebird appears pregame', category: 'family' },
        { title: 'Try the Crab cakes', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Salisbury area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5200 Arthur W. Perdue Stadium, Salisbury, Maryland',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1996, event: 'Stadium opens' },
        { year: 2000, event: 'Orioles affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Sherman race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Sherman', description: 'Orange shorebird' },
      bestExperiences: ['Meeting Sherman', 'Fireworks shows', 'Trying Crab cakes', 'Theme nights'],
      traditions: ['Sherman antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Crab cakes at Section 100',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Sherman meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Sherman at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'fayetteville-woodpeckers': {
    id: 'fayetteville-woodpeckers',
    name: 'Segra Stadium',
    team: 'Fayetteville Woodpeckers',
    opened: 2019,
    capacity: 5200,
    overview: {
      description: 'Segra Stadium in Fayetteville, North Carolina, is the home of the Fayetteville Woodpeckers, Astros Single-A affiliate. This brand new facility features modern amenities with a capacity of 5200 fans. ',
      highlights: [
        'Astros Single-A affiliate since 2019',
        'State-Of-The-Art facility',
        'Fayetteville landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Bunker',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2029, description: 'Seating improvements' },
        { year: 2034, description: 'Concourse and concessions renovation' },
        { year: 2039, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Bunker team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 104 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '130',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: false,
        cocktails: true,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike valet'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Fayetteville Woodpeckers authentic gear', 'Bunker merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Bunkers Playground',
          location: 'Left field corner',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Bunker', description: 'Woodpecker appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Fayetteville area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5200 Segra Stadium, Fayetteville, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2019, event: 'Stadium opens' },
        { year: 2020, event: 'Astros affiliation established' },
        { year: 2024, event: 'First championship' },
        { year: 2029, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Bunker race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Bunker', description: 'Woodpecker' },
      bestExperiences: ['Meeting Bunker', 'Fireworks shows', 'Trying Carolina BBQ', 'Theme nights'],
      traditions: ['Bunker antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Download the app for deals',
        'Best Carolina BBQ at Section 102',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Bunker meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Bunker at Kids zone',
        'Sunset from upper deck',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Happy hour deals',
        'Flex plans'
      ]
    }
  },
  'fredericksburg-nationals': {
    id: 'fredericksburg-nationals',
    name: 'Virginia Credit Union Stadium',
    team: 'Fredericksburg Nationals',
    opened: 2020,
    capacity: 5000,
    overview: {
      description: 'Virginia Credit Union Stadium in Fredericksburg, Virginia, is the home of the Fredericksburg Nationals, Nationals Single-A affiliate. This brand new facility features modern amenities with a capacity of 5000 fans. ',
      highlights: [
        'Nationals Single-A affiliate since 2020',
        'State-Of-The-Art facility',
        'Fredericksburg landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Gus',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2030, description: 'Seating improvements' },
        { year: 2035, description: 'Concourse and concessions renovation' },
        { year: 2040, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Gus team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['General admission', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 100 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '125',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Apple cider donuts'],
      local: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Cauliflower wings'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
        cocktails: true,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike valet'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Fredericksburg Nationals authentic gear', 'Gus merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Guss Playground',
          location: 'Left field corner',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Gus', description: 'Eagle appears pregame', category: 'family' },
        { title: 'Try the Virginia ham', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Clear bags only',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    neighborhood: {
      name: 'Fredericksburg area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5000 Virginia Credit Union Stadium, Fredericksburg, Virginia',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2020, event: 'Stadium opens' },
        { year: 2021, event: 'Nationals affiliation established' },
        { year: 2025, event: 'First championship' },
        { year: 2030, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Gus race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Gus', description: 'Eagle' },
      bestExperiences: ['Meeting Gus', 'Fireworks shows', 'Trying Virginia ham', 'Theme nights'],
      traditions: ['Gus antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Download the app for deals',
        'Best Virginia ham at Section 102',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Gus meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Gus at Kids zone',
        'Team logo at entrance',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Happy hour deals',
        'Season memberships'
      ]
    }
  },
  'kannapolis-cannon-ballers': {
    id: 'kannapolis-cannon-ballers',
    name: 'Atrium Health Ballpark',
    team: 'Kannapolis Cannon Ballers',
    opened: 2020,
    capacity: 4930,
    overview: {
      description: 'Atrium Health Ballpark in Kannapolis, North Carolina, is the home of the Kannapolis Cannon Ballers, White Sox Single-A affiliate. This brand new facility features modern amenities with intimate seating for 4930 fans. ',
      highlights: [
        'White Sox Single-A affiliate since 2020',
        'State-Of-The-Art facility',
        'Kannapolis landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Boomer',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2030, description: 'Seating improvements' },
        { year: 2035, description: 'Concourse and concessions renovation' },
        { year: 2040, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Boomer team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['General admission', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 98 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '123',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Cauliflower wings'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: false,
        cocktails: true,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike valet'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Kannapolis Cannon Ballers authentic gear', 'Boomer merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Boomers Playground',
          location: 'Left field corner',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Boomer', description: 'Cannonball character appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Clear bags only',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    neighborhood: {
      name: 'Kannapolis area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4930 Atrium Health Ballpark, Kannapolis, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2020, event: 'Stadium opens' },
        { year: 2021, event: 'White Sox affiliation established' },
        { year: 2025, event: 'First championship' },
        { year: 2030, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Boomer race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Boomer', description: 'Cannonball character' },
      bestExperiences: ['Meeting Boomer', 'Fireworks shows', 'Trying Carolina BBQ', 'Theme nights'],
      traditions: ['Boomer antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Download the app for deals',
        'Best Carolina BBQ at Section 107',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Park entrance sign',
        'Standing room bar area',
        'Boomer meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Boomer at Kids zone',
        'Team logo at entrance',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Happy hour deals',
        'Season memberships'
      ]
    }
  },
  'lynchburg-hillcats': {
    id: 'lynchburg-hillcats',
    name: 'Bank of the James Stadium',
    team: 'Lynchburg Hillcats',
    opened: 2004,
    capacity: 4291,
    overview: {
      description: 'Bank of the James Stadium in Lynchburg, Virginia, is the home of the Lynchburg Hillcats, Guardians Single-A affiliate. This contemporary ballpark combines modern conveniences with intimate seating for 4291 fans. ',
      highlights: [
        'Guardians Single-A affiliate since 2004',
        'Modern facility',
        'Lynchburg landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Southpaw',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2024, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Southpaw team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 85 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '107',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Apple cider donuts'],
      local: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Lynchburg Hillcats authentic gear', 'Southpaw merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Southpaws Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Southpaw', description: 'Cat appears pregame', category: 'family' },
        { title: 'Try the Virginia ham', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Lynchburg area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4291 Bank of the James Stadium, Lynchburg, Virginia',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2004, event: 'Stadium opens' },
        { year: 2005, event: 'Guardians affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Southpaw race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Southpaw', description: 'Cat' },
      bestExperiences: ['Meeting Southpaw', 'Fireworks shows', 'Trying Virginia ham', 'Theme nights'],
      traditions: ['Southpaw antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Virginia ham at Section 108',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Southpaw meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Southpaw at Kids zone',
        'Team logo at entrance',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'myrtle-beach-pelicans': {
    id: 'myrtle-beach-pelicans',
    name: 'Pelicans Ballpark',
    team: 'Myrtle Beach Pelicans',
    opened: 1999,
    capacity: 6599,
    overview: {
      description: 'Pelicans Ballpark in Myrtle Beach, South Carolina, is the home of the Myrtle Beach Pelicans, Cubs Single-A affiliate. This updated facility maintains its classic charm with a capacity of 6599 fans. ',
      highlights: [
        'Cubs Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Myrtle Beach landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Splash and Deuce',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Splash and Deuce team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 131 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '164',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'She-crab soup'],
      local: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Myrtle Beach Pelicans authentic gear', 'Splash and Deuce merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Splash and Deuces Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Splash and Deuce', description: 'Pelican duo appears pregame', category: 'family' },
        { title: 'Try the Mustard BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Myrtle Beach area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6599 Pelicans Ballpark, Myrtle Beach, South Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1999, event: 'Stadium opens' },
        { year: 2000, event: 'Cubs affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Splash and Deuce race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Splash and Deuce', description: 'Pelican duo' },
      bestExperiences: ['Meeting Splash and Deuce', 'Fireworks shows', 'Trying Mustard BBQ', 'Theme nights'],
      traditions: ['Splash and Deuce antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Mustard BBQ at Section 109',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Splash and Deuce meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Splash and Deuce at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'salem-red-sox': {
    id: 'salem-red-sox',
    name: 'Carilion Clinic Field',
    team: 'Salem Red Sox',
    opened: 1995,
    capacity: 6419,
    overview: {
      description: 'Carilion Clinic Field in Salem, Virginia, is the home of the Salem Red Sox, Red Sox Single-A affiliate. This updated facility maintains its classic charm with a capacity of 6419 fans. ',
      highlights: [
        'Red Sox Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Salem landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Mugsy',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Mugsy team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 128 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '160',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Apple cider donuts'],
      local: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Salem Red Sox authentic gear', 'Mugsy merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Mugsys Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Mugsy', description: 'Red Sox character appears pregame', category: 'family' },
        { title: 'Try the Virginia ham', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Salem area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6419 Carilion Clinic Field, Salem, Virginia',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1995, event: 'Stadium opens' },
        { year: 2000, event: 'Red Sox affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Mugsy race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Mugsy', description: 'Red Sox character' },
      bestExperiences: ['Meeting Mugsy', 'Fireworks shows', 'Trying Virginia ham', 'Theme nights'],
      traditions: ['Mugsy antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Virginia ham at Section 115',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Mugsy meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Mugsy at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'down-east-wood-ducks': {
    id: 'down-east-wood-ducks',
    name: 'Grainger Stadium',
    team: 'Down East Wood Ducks',
    opened: 1949,
    capacity: 4100,
    overview: {
      description: 'Grainger Stadium in Kinston, North Carolina, is the home of the Down East Wood Ducks, Rangers Single-A affiliate. This historic venue offers nostalgic baseball with intimate seating for 4100 fans. ',
      highlights: [
        'Rangers Single-A affiliate since 2000',
        'Historic facility',
        'Kinston landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Dewd',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Dewd team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 82 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '102',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Down East Wood Ducks authentic gear', 'Dewd merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Dewds Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Dewd', description: 'Wood duck appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Kinston area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4100 Grainger Stadium, Kinston, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1949, event: 'Stadium opens' },
        { year: 2000, event: 'Rangers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Dewd race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Dewd', description: 'Wood duck' },
      bestExperiences: ['Meeting Dewd', 'Fireworks shows', 'Trying Carolina BBQ', 'Theme nights'],
      traditions: ['Dewd antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Carolina BBQ at Section 100',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Dewd meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Dewd at Kids zone',
        'Team logo at entrance',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'bradenton-marauders': {
    id: 'bradenton-marauders',
    name: 'LECOM Park',
    team: 'Bradenton Marauders',
    opened: 1923,
    capacity: 8500,
    overview: {
      description: 'LECOM Park in Bradenton, Florida, is the home of the Bradenton Marauders, Pirates Single-A affiliate. This historic venue offers nostalgic baseball with a capacity of 8500 fans. ',
      highlights: [
        'Pirates Single-A affiliate since 2000',
        'Historic facility',
        'Bradenton landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Marty',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Marty team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 170 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '212',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Bradenton Marauders authentic gear', 'Marty merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Martys Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Marty', description: 'Pirate appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Bradenton area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8500 LECOM Park, Bradenton, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1923, event: 'Stadium opens' },
        { year: 2000, event: 'Pirates affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Marty race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Marty', description: 'Pirate' },
      bestExperiences: ['Meeting Marty', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Marty antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cuban sandwiches at Section 118',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Marty meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Marty at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'clearwater-threshers': {
    id: 'clearwater-threshers',
    name: 'BayCare Ballpark',
    team: 'Clearwater Threshers',
    opened: 2004,
    capacity: 8500,
    overview: {
      description: 'BayCare Ballpark in Clearwater, Florida, is the home of the Clearwater Threshers, Phillies Single-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 8500 fans. ',
      highlights: [
        'Phillies Single-A affiliate since 2004',
        'Modern facility',
        'Clearwater landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Phinley',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2024, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Covered concourse provides relief',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Phinley team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 170 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '212',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Clearwater Threshers authentic gear', 'Phinley merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Phinleys Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Phinley', description: 'Thresher shark appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Clearwater area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8500 BayCare Ballpark, Clearwater, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2004, event: 'Stadium opens' },
        { year: 2005, event: 'Phillies affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Phinley race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Phinley', description: 'Thresher shark' },
      bestExperiences: ['Meeting Phinley', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Phinley antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cuban sandwiches at Section 119',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Phinley meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Phinley at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'daytona-tortugas': {
    id: 'daytona-tortugas',
    name: 'Jackie Robinson Ballpark',
    team: 'Daytona Tortugas',
    opened: 1914,
    capacity: 5100,
    overview: {
      description: 'Jackie Robinson Ballpark in Daytona Beach, Florida, is the home of the Daytona Tortugas, Reds Single-A affiliate. This historic venue offers nostalgic baseball with a capacity of 5100 fans. ',
      highlights: [
        'Reds Single-A affiliate since 2000',
        'Historic facility',
        'Daytona Beach landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Shelldon',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Shelldon team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 102 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '127',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Daytona Tortugas authentic gear', 'Shelldon merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Shelldons Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Shelldon', description: 'Turtle appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Daytona Beach area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5100 Jackie Robinson Ballpark, Daytona Beach, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1914, event: 'Stadium opens' },
        { year: 2000, event: 'Reds affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Shelldon race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Shelldon', description: 'Turtle' },
      bestExperiences: ['Meeting Shelldon', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Shelldon antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cuban sandwiches at Section 100',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Shelldon meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Shelldon at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'dunedin-blue-jays': {
    id: 'dunedin-blue-jays',
    name: 'TD Ballpark',
    team: 'Dunedin Blue Jays',
    opened: 1990,
    capacity: 8500,
    overview: {
      description: 'TD Ballpark in Dunedin, Florida, is the home of the Dunedin Blue Jays, Blue Jays Single-A affiliate. This updated facility maintains its classic charm with a capacity of 8500 fans. ',
      highlights: [
        'Blue Jays Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Dunedin landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of DJay',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['DJay team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 170 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '212',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Dunedin Blue Jays authentic gear', 'DJay merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'DJays Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet DJay', description: 'Blue jay appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Dunedin area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8500 TD Ballpark, Dunedin, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1990, event: 'Stadium opens' },
        { year: 2000, event: 'Blue Jays affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'DJay race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'DJay', description: 'Blue jay' },
      bestExperiences: ['Meeting DJay', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['DJay antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cuban sandwiches at Section 100',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'DJay meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With DJay at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'fort-myers-mighty-mussels': {
    id: 'fort-myers-mighty-mussels',
    name: 'Hammond Stadium',
    team: 'Fort Myers Mighty Mussels',
    opened: 1991,
    capacity: 9300,
    overview: {
      description: 'Hammond Stadium in Fort Myers, Florida, is the home of the Fort Myers Mighty Mussels, Twins Single-A affiliate. This updated facility maintains its classic charm with a capacity of 9300 fans. ',
      highlights: [
        'Twins Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Fort Myers landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Mussel Man',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Mussel Man team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 186 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '232',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Fort Myers Mighty Mussels authentic gear', 'Mussel Man merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Mussel Mans Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Mussel Man', description: 'Superhero mussel appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Fort Myers area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '9300 Hammond Stadium, Fort Myers, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1991, event: 'Stadium opens' },
        { year: 2000, event: 'Twins affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Mussel Man race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Mussel Man', description: 'Superhero mussel' },
      bestExperiences: ['Meeting Mussel Man', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Mussel Man antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cuban sandwiches at Section 102',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Mussel Man meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Mussel Man at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'jupiter-hammerheads': {
    id: 'jupiter-hammerheads',
    name: 'Roger Dean Chevrolet Stadium',
    team: 'Jupiter Hammerheads',
    opened: 1998,
    capacity: 6940,
    overview: {
      description: 'Roger Dean Chevrolet Stadium in Jupiter, Florida, is the home of the Jupiter Hammerheads, Marlins Single-A affiliate. This updated facility maintains its classic charm with a capacity of 6940 fans. ',
      highlights: [
        'Marlins Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Jupiter landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Hamilton R. Head',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Hamilton R. Head team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 138 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '173',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Jupiter Hammerheads authentic gear', 'Hamilton R. Head merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Hamilton R. Heads Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Hamilton R. Head', description: 'Hammerhead shark appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Jupiter area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6940 Roger Dean Chevrolet Stadium, Jupiter, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1998, event: 'Stadium opens' },
        { year: 2000, event: 'Marlins affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Hamilton R. Head race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Hamilton R. Head', description: 'Hammerhead shark' },
      bestExperiences: ['Meeting Hamilton R. Head', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Hamilton R. Head antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cuban sandwiches at Section 106',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Hamilton R. Head meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Hamilton R. Head at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'lakeland-flying-tigers': {
    id: 'lakeland-flying-tigers',
    name: 'Publix Field at Joker Marchant Stadium',
    team: 'Lakeland Flying Tigers',
    opened: 1966,
    capacity: 8500,
    overview: {
      description: 'Publix Field at Joker Marchant Stadium in Lakeland, Florida, is the home of the Lakeland Flying Tigers, Tigers Single-A affiliate. This historic venue offers nostalgic baseball with a capacity of 8500 fans. ',
      highlights: [
        'Tigers Single-A affiliate since 2000',
        'Historic facility',
        'Lakeland landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Roary',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Roary team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 170 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '212',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Lakeland Flying Tigers authentic gear', 'Roary merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Roarys Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Roary', description: 'Flying tiger appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Lakeland area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8500 Publix Field at Joker Marchant Stadium, Lakeland, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1966, event: 'Stadium opens' },
        { year: 2000, event: 'Tigers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Roary race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Roary', description: 'Flying tiger' },
      bestExperiences: ['Meeting Roary', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Roary antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cuban sandwiches at Section 108',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Roary meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Roary at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'palm-beach-cardinals': {
    id: 'palm-beach-cardinals',
    name: 'Roger Dean Chevrolet Stadium',
    team: 'Palm Beach Cardinals',
    opened: 1998,
    capacity: 6940,
    overview: {
      description: 'Roger Dean Chevrolet Stadium in Jupiter, Florida, is the home of the Palm Beach Cardinals, Cardinals Single-A affiliate. This updated facility maintains its classic charm with a capacity of 6940 fans. ',
      highlights: [
        'Cardinals Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Jupiter landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Palm Beach',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Palm Beach team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 138 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '173',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Palm Beach Cardinals authentic gear', 'Palm Beach merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Palm Beachs Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Palm Beach', description: 'Cardinal appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Jupiter area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6940 Roger Dean Chevrolet Stadium, Jupiter, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1998, event: 'Stadium opens' },
        { year: 2000, event: 'Cardinals affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Palm Beach race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Palm Beach', description: 'Cardinal' },
      bestExperiences: ['Meeting Palm Beach', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Palm Beach antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cuban sandwiches at Section 112',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Palm Beach meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Palm Beach at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'st-lucie-mets': {
    id: 'st-lucie-mets',
    name: 'Clover Park',
    team: 'St. Lucie Mets',
    opened: 1988,
    capacity: 7000,
    overview: {
      description: 'Clover Park in Port St. Lucie, Florida, is the home of the St. Lucie Mets, Mets Single-A affiliate. This historic venue offers nostalgic baseball with a capacity of 7000 fans. ',
      highlights: [
        'Mets Single-A affiliate since 2000',
        'Historic facility',
        'Port St. Lucie landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Klutch',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Klutch team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 140 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '175',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['St. Lucie Mets authentic gear', 'Klutch merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Klutchs Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Klutch', description: 'Baseball character appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Port St. Lucie area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7000 Clover Park, Port St. Lucie, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1988, event: 'Stadium opens' },
        { year: 2000, event: 'Mets affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Klutch race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Klutch', description: 'Baseball character' },
      bestExperiences: ['Meeting Klutch', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Klutch antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cuban sandwiches at Section 115',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Klutch meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Klutch at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'tampa-tarpons': {
    id: 'tampa-tarpons',
    name: 'George M. Steinbrenner Field',
    team: 'Tampa Tarpons',
    opened: 1996,
    capacity: 11076,
    overview: {
      description: 'George M. Steinbrenner Field in Tampa, Florida, is the home of the Tampa Tarpons, Yankees Single-A affiliate. This updated facility maintains its classic charm with a capacity of 11076 fans. ',
      highlights: [
        'Yankees Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Tampa landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Salty',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Salty team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Private entrance'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Two suite levels'],
          amenities: ['Catering options', 'Private restrooms', 'In-suite attendant']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 221 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '276',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'VIP Lot', distance: '50 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Light rail'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: '2 hours early'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Tampa Tarpons authentic gear', 'Salty merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Saltys Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '50+ spaces'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Salty', description: 'Tarpon fish appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Tampa area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '11076 George M. Steinbrenner Field, Tampa, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1996, event: 'Stadium opens' },
        { year: 2000, event: 'Yankees affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Salty race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Salty', description: 'Tarpon fish' },
      bestExperiences: ['Meeting Salty', 'Fireworks shows', 'Trying Cuban sandwiches', 'Theme nights'],
      traditions: ['Salty antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cuban sandwiches at Section 116',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Salty meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Salty at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'fresno-grizzlies': {
    id: 'fresno-grizzlies',
    name: 'Chukchansi Park',
    team: 'Fresno Grizzlies',
    opened: 2002,
    capacity: 10650,
    overview: {
      description: 'Chukchansi Park in Fresno, California, is the home of the Fresno Grizzlies, Rockies Single-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 10650 fans. ',
      highlights: [
        'Rockies Single-A affiliate since 2002',
        'Modern facility',
        'Fresno landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Parker',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Parker team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Private entrance'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Two suite levels'],
          amenities: ['Catering options', 'Private restrooms', 'In-suite attendant']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 213 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '266',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'VIP Lot', distance: '50 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Light rail'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: '2 hours early'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Fresno Grizzlies authentic gear', 'Parker merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Parkers Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '50+ spaces'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Parker', description: 'Grizzly bear appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Fresno area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '10650 Chukchansi Park, Fresno, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2002, event: 'Stadium opens' },
        { year: 2003, event: 'Rockies affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Parker race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Parker', description: 'Grizzly bear' },
      bestExperiences: ['Meeting Parker', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Parker antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Fish tacos at Section 102',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Parker meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Parker at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'inland-empire-66ers': {
    id: 'inland-empire-66ers',
    name: 'San Manuel Stadium',
    team: 'Inland Empire 66ers',
    opened: 1996,
    capacity: 8000,
    overview: {
      description: 'San Manuel Stadium in San Bernardino, California, is the home of the Inland Empire 66ers, Angels Single-A affiliate. This updated facility maintains its classic charm with a capacity of 8000 fans. ',
      highlights: [
        'Angels Single-A affiliate since 2000',
        'Renovated Classic facility',
        'San Bernardino landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Bernie',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Bernie team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 160 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '200',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Inland Empire 66ers authentic gear', 'Bernie merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Bernies Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Bernie', description: 'Saint Bernard appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'San Bernardino area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8000 San Manuel Stadium, San Bernardino, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1996, event: 'Stadium opens' },
        { year: 2000, event: 'Angels affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Bernie race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Bernie', description: 'Saint Bernard' },
      bestExperiences: ['Meeting Bernie', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Bernie antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Fish tacos at Section 105',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Bernie meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Bernie at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'lake-elsinore-storm': {
    id: 'lake-elsinore-storm',
    name: 'Lake Elsinore Diamond',
    team: 'Lake Elsinore Storm',
    opened: 1994,
    capacity: 7866,
    overview: {
      description: 'Lake Elsinore Diamond in Lake Elsinore, California, is the home of the Lake Elsinore Storm, Padres Single-A affiliate. This updated facility maintains its classic charm with a capacity of 7866 fans. ',
      highlights: [
        'Padres Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Lake Elsinore landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Thunder',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Thunder team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 157 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '196',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Lake Elsinore Storm authentic gear', 'Thunder merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Thunders Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Thunder', description: 'Storm cloud appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Lake Elsinore area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7866 Lake Elsinore Diamond, Lake Elsinore, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1994, event: 'Stadium opens' },
        { year: 2000, event: 'Padres affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Thunder race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Thunder', description: 'Storm cloud' },
      bestExperiences: ['Meeting Thunder', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Thunder antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Fish tacos at Section 108',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Thunder meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Thunder at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'modesto-nuts': {
    id: 'modesto-nuts',
    name: 'John Thurman Field',
    team: 'Modesto Nuts',
    opened: 1955,
    capacity: 4000,
    overview: {
      description: 'John Thurman Field in Modesto, California, is the home of the Modesto Nuts, Mariners Single-A affiliate. This historic venue offers nostalgic baseball with intimate seating for 4000 fans. ',
      highlights: [
        'Mariners Single-A affiliate since 2000',
        'Historic facility',
        'Modesto landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Al the Almond and Wally the Walnut',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Al the Almond and Wally the Walnut team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 80 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '100',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Modesto Nuts authentic gear', 'Al the Almond and Wally the Walnut merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Al the Almond and Wally the Walnuts Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Al the Almond and Wally the Walnut', description: 'Nut duo appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Modesto area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4000 John Thurman Field, Modesto, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1955, event: 'Stadium opens' },
        { year: 2000, event: 'Mariners affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Al the Almond and Wally the Walnut race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Al the Almond and Wally the Walnut', description: 'Nut duo' },
      bestExperiences: ['Meeting Al the Almond and Wally the Walnut', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Al the Almond and Wally the Walnut antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Fish tacos at Section 109',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Al the Almond and Wally the Walnut meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Al the Almond and Wally the Walnut at Kids zone',
        'Team logo at entrance',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'rancho-cucamonga-quakes': {
    id: 'rancho-cucamonga-quakes',
    name: 'LoanMart Field',
    team: 'Rancho Cucamonga Quakes',
    opened: 1993,
    capacity: 6615,
    overview: {
      description: 'LoanMart Field in Rancho Cucamonga, California, is the home of the Rancho Cucamonga Quakes, Dodgers Single-A affiliate. This updated facility maintains its classic charm with a capacity of 6615 fans. ',
      highlights: [
        'Dodgers Single-A affiliate since 2000',
        'Renovated Classic facility',
        'Rancho Cucamonga landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Tremor',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Tremor team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 132 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '165',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Rancho Cucamonga Quakes authentic gear', 'Tremor merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Tremors Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Tremor', description: 'Earthquake character appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Rancho Cucamonga area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6615 LoanMart Field, Rancho Cucamonga, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1993, event: 'Stadium opens' },
        { year: 2000, event: 'Dodgers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Tremor race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Tremor', description: 'Earthquake character' },
      bestExperiences: ['Meeting Tremor', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Tremor antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Fish tacos at Section 114',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Tremor meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Tremor at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'san-jose-giants': {
    id: 'san-jose-giants',
    name: 'Excite Ballpark',
    team: 'San Jose Giants',
    opened: 1942,
    capacity: 4200,
    overview: {
      description: 'Excite Ballpark in San Jose, California, is the home of the San Jose Giants, Giants Single-A affiliate. This historic venue offers nostalgic baseball with intimate seating for 4200 fans. ',
      highlights: [
        'Giants Single-A affiliate since 2000',
        'Historic facility',
        'San Jose landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Gigante',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Gigante team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 84 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '105',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['San Jose Giants authentic gear', 'Gigante merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Gigantes Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Gigante', description: 'Giant mascot appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'San Jose area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4200 Excite Ballpark, San Jose, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1942, event: 'Stadium opens' },
        { year: 2000, event: 'Giants affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Gigante race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Gigante', description: 'Giant mascot' },
      bestExperiences: ['Meeting Gigante', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Gigante antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Fish tacos at Section 115',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Gigante meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Gigante at Kids zone',
        'Team logo at entrance',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'stockton-ports': {
    id: 'stockton-ports',
    name: 'Banner Island Ballpark',
    team: 'Stockton Ports',
    opened: 2005,
    capacity: 5200,
    overview: {
      description: 'Banner Island Ballpark in Stockton, California, is the home of the Stockton Ports, Athletics Single-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 5200 fans. ',
      highlights: [
        'Athletics Single-A affiliate since 2005',
        'Modern facility',
        'Stockton landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Splash',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2025, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Splash team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 104 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '130',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Stockton Ports authentic gear', 'Splash merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Splashs Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Splash', description: 'Port character appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Stockton area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5200 Banner Island Ballpark, Stockton, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2005, event: 'Stadium opens' },
        { year: 2006, event: 'Athletics affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Splash race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Splash', description: 'Port character' },
      bestExperiences: ['Meeting Splash', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Splash antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Fish tacos at Section 115',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Splash meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Splash at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'visalia-rawhide': {
    id: 'visalia-rawhide',
    name: 'Valley Strong Ballpark',
    team: 'Visalia Rawhide',
    opened: 2009,
    capacity: 2468,
    overview: {
      description: 'Valley Strong Ballpark in Visalia, California, is the home of the Visalia Rawhide, Diamondbacks Single-A affiliate. This contemporary ballpark combines modern conveniences with intimate seating for 2468 fans. ',
      highlights: [
        'Diamondbacks Single-A affiliate since 2009',
        'Modern facility',
        'Visalia landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Tipper',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2019, description: 'LED lighting upgrade' },
        { year: 2024, description: 'Concourse and concessions renovation' },
        { year: 2029, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Tipper team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 49 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Alcohol-free sections', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '61',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Garlic fries', 'Craft beer', 'California rolls'],
      local: ['Fish tacos', 'Garlic fries', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Mini corn dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Stone', 'Sierra Nevada', 'Lagunitas', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Stone', 'Sierra Nevada', 'Lagunitas']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Visalia Rawhide authentic gear', 'Tipper merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Tippers Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Tipper', description: 'Cowhide baseball appears pregame', category: 'family' },
        { title: 'Try the Fish tacos', description: 'Local favorite', category: 'food' },
        { title: 'Dollar beers', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Visalia area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '2468 Valley Strong Ballpark, Visalia, California',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2009, event: 'Stadium opens' },
        { year: 2010, event: 'Diamondbacks affiliation established' },
        { year: 2014, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Tipper race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Tipper', description: 'Cowhide baseball' },
      bestExperiences: ['Meeting Tipper', 'Fireworks shows', 'Trying Fish tacos', 'Theme nights'],
      traditions: ['Tipper antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Fish tacos at Section 118',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Tipper meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Tipper at Kids zone',
        'Team logo at entrance',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  }
};