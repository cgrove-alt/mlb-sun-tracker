import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides: Record<string, StadiumGuide> = {
  'akron-rubberducks': {
      id: 'akron-rubberducks',
      name: 'Canal Park',
      team: 'Akron RubberDucks',
      opened: 1997,
      capacity: 7630,
      overview: {
        description: 'Canal Park in downtown Akron serves as home to the Guardians Double-A affiliate, nestled in the heart of Ohio\'s rubber capital with views of the city skyline.',
        highlights: [
          'Guardians Double-A affiliate', 
          'Downtown Akron location',
          'Ohio & Erie Canal proximity',
          'Historic rubber industry connection',
          'Family-friendly atmosphere'
        ],
        uniqueFeatures: [
          'Downtown urban setting',
          'Canal heritage theming',
          'Duck pond in play area',
          'Rubber industry tributes',
          'City skyline views'
        ],
        renovations: [
          { year: 2012, description: 'Video board upgrade' },
          { year: 2018, description: 'Seating improvements' },
          { year: 2021, description: 'Concourse renovations' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side', 'Sections 101-105'],
          afternoon: ['Upper deck sections 201-210', 'Duck Creek Pavilion'],
          evening: ['Most sections after 6 PM']
        },
        coveredSeating: ['Duck Creek Pavilion', 'Upper deck overhang', 'Suites'],
        shadeTips: [
          'Ohio summers are humid, seek shade',
          'Third base side best for afternoon games',
          'Upper deck provides overhead coverage',
          'Duck Creek Pavilion fully covered'
        ],
        sunProtection: {
          shadedConcourses: ['Main concourse', 'Upper level'],
          indoorAreas: ['Duck Creek Pavilion', 'Team store'],
          sunscreenStations: ['Guest services', 'First aid']
        },
        worstSunExposure: ['First base side sections 115-120', 'Outfield lawn'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 56, avgHumidity: 65, rainChance: 40, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers' },
          { month: 'May', avgTemp: 66, avgHumidity: 68, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Pleasant evenings' },
          { month: 'June', avgTemp: 75, avgHumidity: 70, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade recommended' },
          { month: 'July', avgTemp: 79, avgHumidity: 72, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
          { month: 'August', avgTemp: 77, avgHumidity: 73, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Evening games best' },
          { month: 'September', avgTemp: 70, avgHumidity: 70, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Comfortable' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            {
              name: 'Duck Creek Pavilion',
              perks: ['All-inclusive food/drinks', 'Climate controlled', 'Private bathrooms'],
              access: 'Left field line'
            }
          ],
          suites: {
            levels: ['Suite level behind home plate'],
            amenities: ['Catering', 'Private restrooms', 'Climate control']
          },
          specialAreas: [
            { name: 'Lawn', description: 'Outfield grass seating', capacity: 1500 }
          ]
        },
        budgetOptions: ['Lawn seating', 'Upper reserved', 'Bleacher seats'],
        familySections: ['Sections 201-205', 'Lawn area'],
        standingRoom: ['Concourse areas', 'Outfield bar'],
        partyAreas: [
          {
            name: 'Duck Creek Pavilion',
            capacity: '300',
            description: 'All-inclusive group area',
            amenities: ['Full bar', 'Buffet', 'Private restrooms']
          }
        ],
        tips: [
          { section: 'Behind home plate', tip: 'Best views but pricier', category: 'experience' },
          { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
          { section: 'Lawn', tip: 'Bring blankets, great for families', category: 'family' },
          { section: 'Upper deck', tip: 'Good value with overhead coverage', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Orbit Dog', 'Rubber City Nachos', 'Duck Donuts'],
        local: ['Swensons Galley Boy', 'Akron craft beers', 'Ohio sweet corn'],
        healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
        vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
        glutenFree: ['Dedicated stand on main concourse'],
        kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
        alcohol: {
          beer: ['Local craft selection', 'Domestic options'],
          wine: true,
          cocktails: false,
          localBreweries: ['Hoppin\' Frog', 'Thirsty Dog', 'Missing Falls']
        }
      },
      parking: {
        lots: [
          { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
          { name: 'Canal Place Garage', distance: '0.3 miles', price: '$3-5', shadedSpots: true, covered: true },
          { name: 'Downtown Deck', distance: '0.4 miles', price: '$3', shadedSpots: true, covered: true }
        ],
        streetParking: {
          available: true,
          restrictions: 'Meters until 6 PM',
          tip: 'Free after 6 PM on most streets'
        },
        alternativeTransport: {
          publicTransit: ['METRO RTA buses'],
          rideShare: 'Uber/Lyft pickup at main gate',
          bicycle: 'Bike racks at main entrance'
        }
      },
      gates: [
        {
          name: 'Home Plate Gate',
          location: 'Main Street',
          bestFor: ['All seating'],
          openTime: '1 hour before first pitch'
        },
        {
          name: 'Left Field Gate', 
          location: 'Exchange Street',
          bestFor: ['Pavilion', 'Lawn'],
          openTime: '1 hour before first pitch'
        }
      ],
      amenities: {
        merchandise: [
          { location: 'Main concourse behind home plate', exclusive: ['RubberDucks gear', 'Guardians items'] },
          { location: 'Left field corner', exclusive: ['Discount items'] }
        ],
        firstAid: ['Behind section 108', 'Near Duck Creek Pavilion'],
        babyChanging: ['All family restrooms'],
        atms: ['Main concourse', 'Near team store'],
        wifi: { available: true, network: 'RubberDucks_Guest' },
        chargingStations: ['Duck Creek Pavilion', 'Suite level'],
        kidZones: [
          { name: 'Kids Landing', location: 'Right field', activities: ['Playground', 'Duck pond', 'Speed pitch'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels accessible via elevators'],
          entrance: 'All gates wheelchair accessible',
          elevators: ['Behind home plate', 'First base side']
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
          { title: 'Arrive early', description: 'Downtown parking fills up', category: 'arrival' },
          { title: 'Duck feeding', description: 'Kids can feed ducks in pond', category: 'family' },
          { title: 'Fireworks nights', description: 'Popular Friday/Saturday games', category: 'experience' },
          { title: 'Downtown dining', description: 'Many restaurants within walking distance', category: 'food' }
        ],
        typicalSchedule: {
          gatesOpen: '1 hour before',
          battingPractice: 'Varies by team',
          firstPitch: '6:35 PM weekdays, 7:05 PM weekends',
          rushHours: ['5:30-6:30 PM']
        },
        security: {
          allowedBags: 'Small bags and purses',
          prohibitedItems: ['Outside food/drink', 'Weapons', 'Laser pointers'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Downtown Akron',
        description: 'Urban downtown setting with restaurants and nightlife',
        beforeGame: ['Lock 3 Park', 'Northside Marketplace', 'Canal towpath'],
        afterGame: ['Downtown bars', 'Highland Square nightlife'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '300 S Main St, Akron, OH 44308',
        publicTransit: {
          bus: [
            { routes: ['110', '113', '126'], stops: ['Main & Exchange', 'Main & Mill'] }
          ]
        },
        driving: {
          majorRoutes: ['I-76/I-77 to downtown exits', 'Route 8 to downtown'],
          typicalTraffic: 'Moderate during rush hours',
          bestApproach: 'From I-76/77, take exit 22 to downtown'
        },
        rideShare: {
          pickupZone: 'Main Street by home plate gate',
          dropoffZone: 'Main Street',
          surgePricing: 'Common after fireworks games'
        }
      },
      history: {
        timeline: [
          { year: 1997, event: 'Canal Park opens' },
          { year: 1997, event: 'Aeros inaugural season' },
          { year: 2014, event: 'Rebrand to RubberDucks' },
          { year: 2021, event: 'Guardians affiliation begins' }
        ],
        traditions: [
          { name: 'Rubber Duck Race', description: 'Annual charity event in canal' },
          { name: 'Orbit mascot', description: 'Space-themed mascot from Aeros era still appears' }
        ]
      },
      fanExperience: {
        atmosphere: 'Family-friendly with downtown energy',
        bestExperiences: [
          'Fireworks Fridays',
          'Thirsty Thursday drink specials',
          'Kids run bases Sundays',
          'Duck feeding at Kids Landing'
        ],
        traditions: [
          'Seventh inning stretch rubber duck squeak',
          'Orbit\'s antics between innings',
          'Local music acts pregame'
        ],
        mascot: {
          name: 'Webster',
          description: 'Giant rubber duck with attitude'
        }
      },
      proTips: {
        insiderTips: [
          'Park in downtown garages for easy exit',
          'Duck Creek Pavilion worth it for groups',
          'Try Swensons Galley Boy burger',
          'Kids Landing opens 90 minutes early'
        ],
        avoidThese: [
          'Lawn seating in rain',
          'Driving after fireworks',
          'First base side on hot days'
        ],
        hiddenGems: [
          'Canal towpath for pregame walk',
          'Lock 3 concerts after games',
          'Team store clearance section'
        ],
        photoSpots: [
          'With Webster by home plate',
          'Kids Landing duck pond',
          'Downtown skyline from upper deck'
        ],
        bestValue: [
          'Thirsty Thursday deals',
          'Lawn seating for families',
          'Upper reserved sections'
        ]
      }
    },

    'richmond-flying-squirrels': {
      id: 'richmond-flying-squirrels',
      name: 'The Diamond',
      team: 'Richmond Flying Squirrels',
      opened: 1985,
      capacity: 9560,
      overview: {
        description: 'The Diamond on Richmond\'s Boulevard serves as the current home of the Giants Double-A affiliate, with plans for a new stadium in development.',
        highlights: [
          'Giants Double-A affiliate',
          'Richmond\'s Boulevard location',
          'Historic Virginia capital setting',
          'Traditional ballpark feel',
          'New stadium planned'
        ],
        uniqueFeatures: [
          'Classic 1980s architecture',
          'Arthur Ashe mural',
          'Wide concourses',
          'Natural grass field',
          'Downtown Richmond proximity'
        ],
        renovations: [
          { year: 2010, description: 'Rebranding updates' },
          { year: 2014, description: 'Video board installation' },
          { year: 2020, description: 'Safety improvements' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side sections 201-207'],
          afternoon: ['Sections 301-310 upper deck', 'Suites'],
          evening: ['Most sections after 6:30 PM']
        },
        coveredSeating: ['Upper deck overhang rows', 'Suite level', 'Press box level'],
        shadeTips: [
          'Virginia summers hot and humid',
          'Upper deck provides best coverage',
          'Third base side for afternoon shade',
          'Seek covered concourse areas'
        ],
        sunProtection: {
          shadedConcourses: ['Main concourse partially covered'],
          indoorAreas: ['Flying Squirrels team store', 'Suite level'],
          sunscreenStations: ['Guest services']
        },
        worstSunExposure: ['First base field boxes', 'Sections 115-120'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 62, avgHumidity: 64, rainChance: 35, typicalConditions: 'Variable spring weather', shadeTip: 'Light jacket recommended' },
          { month: 'May', avgTemp: 71, avgHumidity: 68, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Ideal conditions' },
          { month: 'June', avgTemp: 79, avgHumidity: 71, rainChance: 40, typicalConditions: 'Getting humid', shadeTip: 'Shade becomes important' },
          { month: 'July', avgTemp: 83, avgHumidity: 73, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
          { month: 'August', avgTemp: 82, avgHumidity: 74, rainChance: 40, typicalConditions: 'Peak humidity', shadeTip: 'Evening games best' },
          { month: 'September', avgTemp: 75, avgHumidity: 71, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            {
              name: 'Funnville Fan Zone',
              perks: ['All-you-can-eat', 'Dedicated entrance', 'Special activities'],
              access: 'Left field area'
            }
          ],
          suites: {
            levels: ['Suite level behind home plate'],
            amenities: ['Climate control', 'Catering', 'Private restrooms']
          },
          specialAreas: [
            { name: 'Party Deck', description: 'Right field group area', capacity: 200 }
          ]
        },
        budgetOptions: ['Upper reserved', 'General admission', 'Outfield corners'],
        familySections: ['Funnville Fan Zone', 'Sections 201-205'],
        standingRoom: ['Concourse areas', 'Party deck'],
        partyAreas: [
          {
            name: 'Right Field Party Deck',
            capacity: '200',
            description: 'Group gathering space',
            amenities: ['Picnic tables', 'Dedicated concessions']
          }
        ],
        tips: [
          { section: 'Behind home', tip: 'Classic view but sun exposure', category: 'experience' },
          { section: 'Upper deck', tip: 'Best shade and value', category: 'shade' },
          { section: 'Funnville', tip: 'Great for families with kids', category: 'family' },
          { section: 'Third base', tip: 'Ideal for afternoon games', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Flying Squirrels Nachos', 'Richmond BBQ', 'Nutzy\'s Nuts'],
        local: ['Virginia ham biscuits', 'Richmond craft beers', 'Peanuts from Virginia'],
        healthy: ['Garden salads', 'Grilled chicken', 'Fresh fruit'],
        vegetarian: ['Veggie burgers', 'Cheese pizza', 'Nachos'],
        glutenFree: ['Limited options at main stand'],
        kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Snow cones'],
        alcohol: {
          beer: ['Virginia craft selection', 'Domestic standards'],
          wine: true,
          cocktails: false,
          localBreweries: ['Veil Brewing', 'Triple Crossing', 'Hardywood']
        }
      },
      parking: {
        lots: [
          { name: 'Main Lot', distance: '50 yards', price: '$5', shadedSpots: false, covered: false },
          { name: 'Boulevard Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
          { name: 'Overflow', distance: '400 yards', price: 'Free', shadedSpots: false, covered: false }
        ],
        streetParking: {
          available: true,
          restrictions: 'Limited on Boulevard',
          tip: 'Side streets better option'
        },
        alternativeTransport: {
          publicTransit: ['GRTC bus routes'],
          rideShare: 'Pickup at main entrance',
          bicycle: 'Racks near gate'
        }
      },
      gates: [
        {
          name: 'Main Gate',
          location: 'Boulevard entrance',
          bestFor: ['All seating'],
          openTime: '90 minutes before first pitch'
        },
        {
          name: 'VIP Gate',
          location: 'Suite entrance',
          bestFor: ['Suites', 'Club areas'],
          openTime: '90 minutes before first pitch'
        }
      ],
      amenities: {
        merchandise: [
          { location: 'Main concourse', exclusive: ['Flying Squirrels gear', 'Nutzy merchandise'] }
        ],
        firstAid: ['Behind home plate'],
        babyChanging: ['Family restrooms'],
        atms: ['Main entrance', 'Third base side'],
        wifi: { available: false },
        chargingStations: ['Limited in suites'],
        kidZones: [
          { name: 'Funnville', location: 'Left field', activities: ['Inflatables', 'Speed pitch', 'Face painting'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['Designated areas throughout'],
          entrance: 'All gates accessible',
          elevators: ['To upper levels']
        },
        assistiveListening: true,
        signageAndBraille: false,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['Each level'],
        accessibleConcessions: ['Main stands'],
        parkingSpaces: '15+ designated'
      },
      gameDay: {
        tips: [
          { title: 'Boulevard traffic', description: 'Arrive early on busy nights', category: 'arrival' },
          { title: 'Nutzy\'s antics', description: 'Popular mascot entertainment', category: 'experience' },
          { title: 'Virginia weather', description: 'Humidity can be intense', category: 'weather' },
          { title: 'Craft beer selection', description: 'Try local Richmond brews', category: 'food' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          battingPractice: 'Select dates',
          firstPitch: '6:35 PM or 7:05 PM',
          rushHours: ['5:00-6:30 PM']
        },
        security: {
          allowedBags: 'Small bags only',
          prohibitedItems: ['Outside food/drink', 'Weapons'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'The Boulevard',
        description: 'Mixed commercial/residential area near downtown',
        beforeGame: ['Scott\'s Addition breweries', 'Boulevard restaurants'],
        afterGame: ['Scott\'s Addition nightlife', 'Downtown Richmond'],
        radius: '1 mile'
      },
      transportation: {
        address: '3001 N Arthur Ashe Blvd, Richmond, VA 23230',
        publicTransit: {
          bus: [
            { routes: ['16', '20'], stops: ['Boulevard & Hermitage'] }
          ]
        },
        driving: {
          majorRoutes: ['I-95', 'I-64', 'Route 1'],
          typicalTraffic: 'Heavy during rush hours',
          bestApproach: 'I-95 to Boulevard exit'
        },
        rideShare: {
          pickupZone: 'Main entrance circle',
          dropoffZone: 'Main entrance',
          surgePricing: 'After popular games'
        }
      },
      history: {
        timeline: [
          { year: 1985, event: 'The Diamond opens' },
          { year: 2010, event: 'Flying Squirrels arrive' },
          { year: 2010, event: 'Giants affiliation begins' },
          { year: 2025, event: 'New stadium planned' }
        ],
        traditions: [
          { name: 'Nutzy', description: 'Beloved flying squirrel mascot' },
          { name: 'Funnville', description: 'Family entertainment zone' }
        ]
      },
      fanExperience: {
        atmosphere: 'Traditional baseball with quirky charm',
        bestExperiences: [
          'Nutzy\'s between-inning antics',
          'Friday night fireworks',
          'Funnville family zone',
          'Local food trucks'
        ],
        traditions: [
          'Nutzy\'s t-shirt toss',
          'Sweet Caroline sing-along',
          'Thursday Thirsty specials'
        ],
        mascot: {
          name: 'Nutzy',
          description: 'Energetic flying squirrel'
        }
      },
      proTips: {
        insiderTips: [
          'Upper deck best value',
          'Scott\'s Addition before game',
          'Nutzy meet-and-greet early',
          'Side street parking free'
        ],
        avoidThese: [
          'Boulevard traffic at 5 PM',
          'Field boxes in afternoon',
          'Limited concessions late'
        ],
        hiddenGems: [
          'Arthur Ashe mural photo op',
          'Scott\'s Addition breweries',
          'Side entrance shorter lines'
        ],
        photoSpots: [
          'With Nutzy',
          'Arthur Ashe mural',
          'Diamond sign entrance'
        ],
        bestValue: [
          'Upper reserved seats',
          'Thursday specials',
          'Group packages'
        ]
      }
    },

    'harrisburg-senators': {
      id: 'harrisburg-senators',
      name: 'FNB Field',
      team: 'Harrisburg Senators',
      opened: 1987,
      capacity: 6187,
      overview: {
        description: 'FNB Field sits on City Island in the Susquehanna River, offering unique views of the Pennsylvania capital skyline and riverfront setting.',
        highlights: [
          'Nationals Double-A affiliate',
          'City Island location',
          'Susquehanna River setting',
          'Harrisburg skyline views',
          'Accessible by pedestrian bridge'
        ],
        uniqueFeatures: [
          'Island ballpark setting',
          'Skyline views',
          'Riverside boardwalk',
          'Beach volleyball courts nearby',
          'Mini golf adjacent'
        ],
        renovations: [
          { year: 1995, description: 'Flood recovery renovations' },
          { year: 2010, description: 'Seating upgrades' },
          { year: 2020, description: 'New videoboard' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side 101-107'],
          afternoon: ['Upper sections 201-210', 'Suites'],
          evening: ['Most sections after 6 PM']
        },
        coveredSeating: ['Suites', 'Upper deck overhang', 'Picnic pavilion'],
        shadeTips: [
          'River location can be breezy',
          'Pennsylvania summers humid',
          'Third base side best shade',
          'Upper deck provides coverage'
        ],
        sunProtection: {
          shadedConcourses: ['Main concourse partially'],
          indoorAreas: ['Team store', 'Suite level'],
          sunscreenStations: ['Guest services']
        },
        worstSunExposure: ['First base field level', 'Sections 115-120'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 57, avgHumidity: 62, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Bring layers' },
          { month: 'May', avgTemp: 67, avgHumidity: 65, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Comfortable' },
          { month: 'June', avgTemp: 76, avgHumidity: 68, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Shade helpful' },
          { month: 'July', avgTemp: 81, avgHumidity: 70, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
          { month: 'August', avgTemp: 79, avgHumidity: 71, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
          { month: 'September', avgTemp: 71, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Pleasant evenings' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            {
              name: 'Riverside Club',
              perks: ['All-inclusive food/drinks', 'Climate controlled', 'River views'],
              access: 'Third base side'
            }
          ],
          suites: {
            levels: ['Suite level'],
            amenities: ['Private bathrooms', 'Catering', 'Climate control']
          },
          specialAreas: [
            { name: 'Boardwalk', description: 'Standing room with river views', capacity: 200 }
          ]
        },
        budgetOptions: ['General admission', 'Lawn seating', 'Bleachers'],
        familySections: ['Sections 101-105'],
        standingRoom: ['Boardwalk', 'Concourse'],
        partyAreas: [
          {
            name: 'Picnic Pavilion',
            capacity: '250',
            description: 'Left field group area',
            amenities: ['Covered seating', 'Buffet options']
          }
        ],
        tips: [
          { section: 'Riverside Club', tip: 'Best views and amenities', category: 'experience' },
          { section: 'Third base', tip: 'Skyline views and shade', category: 'shade' },
          { section: 'Boardwalk', tip: 'Unique standing room experience', category: 'experience' },
          { section: 'Lawn', tip: 'Budget friendly for families', category: 'family' }
        ]
      },
      concessions: {
        signature: ['Senators Sausage', 'Whoopie pies', 'Chesapeake crab items'],
        local: ['Pennsylvania Dutch treats', 'Hershey ice cream', 'Yuengling beer'],
        healthy: ['Grilled options', 'Salads'],
        vegetarian: ['Veggie burgers', 'Pizza'],
        glutenFree: ['Limited options'],
        kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin\' Dots'],
        alcohol: {
          beer: ['Yuengling', 'Local craft options'],
          wine: true,
          cocktails: false,
          localBreweries: ['Troegs', 'Appalachian Brewing', 'Ever Grain']
        }
      },
      parking: {
        lots: [
          { name: 'City Island Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
          { name: 'Downtown Garages', distance: '0.5 miles + walk', price: '$5-10', shadedSpots: true, covered: true }
        ],
        streetParking: {
          available: true,
          restrictions: 'Downtown meters',
          tip: 'Park downtown and walk bridge'
        },
        alternativeTransport: {
          publicTransit: ['CAT bus to downtown'],
          rideShare: 'Drop off at bridge',
          bicycle: 'Bike path to island'
        }
      },
      gates: [
        {
          name: 'Main Gate',
          location: 'Behind home plate',
          bestFor: ['All seating'],
          openTime: '90 minutes before first pitch'
        }
      ],
      amenities: {
        merchandise: [
          { location: 'Main concourse', exclusive: ['Senators gear', 'Nationals items'] }
        ],
        firstAid: ['Behind home plate'],
        babyChanging: ['Family restrooms'],
        atms: ['Main entrance', 'Concourse'],
        wifi: { available: false },
        chargingStations: ['Limited in suites'],
        kidZones: [
          { name: 'Kids Zone', location: 'Left field', activities: ['Playground', 'Games'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['Designated areas all levels'],
          entrance: 'Main gate accessible',
          elevators: ['To upper deck']
        },
        assistiveListening: true,
        signageAndBraille: false,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['Each level'],
        accessibleConcessions: ['Main concourse'],
        parkingSpaces: '10+ designated'
      },
      gameDay: {
        tips: [
          { title: 'Walk the bridge', description: 'Scenic approach from downtown', category: 'arrival' },
          { title: 'Island activities', description: 'Mini golf, beach volleyball before game', category: 'experience' },
          { title: 'River breeze', description: 'Can be cool in evening', category: 'weather' },
          { title: 'Skyline views', description: 'Best from third base side', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          battingPractice: 'Select games',
          firstPitch: '6:30 PM or 7:00 PM',
          rushHours: ['5:30-6:30 PM']
        },
        security: {
          allowedBags: 'Small bags allowed',
          prohibitedItems: ['Outside food/drink', 'Weapons'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'City Island',
        description: 'Recreational island in Susquehanna River',
        beforeGame: ['Downtown Harrisburg restaurants', 'Riverfront park'],
        afterGame: ['Downtown bars', '2nd Street nightlife'],
        radius: '0.5 mile walk'
      },
      transportation: {
        address: 'City Island, Harrisburg, PA 17101',
        publicTransit: {
          bus: [
            { routes: ['CAT routes'], stops: ['Downtown transfer center'] }
          ]
        },
        driving: {
          majorRoutes: ['I-83', 'I-81', 'Route 22'],
          typicalTraffic: 'Moderate at rush hour',
          bestApproach: 'I-83 to 2nd Street, cross Market Street Bridge'
        },
        rideShare: {
          pickupZone: 'Near pedestrian bridge',
          dropoffZone: 'Bridge entrance',
          surgePricing: 'After fireworks games'
        }
      },
      history: {
        timeline: [
          { year: 1987, event: 'Riverside Stadium opens' },
          { year: 1995, event: 'Flood damage and rebuild' },
          { year: 2005, event: 'Renamed Commerce Bank Park' },
          { year: 2016, event: 'Becomes FNB Field' }
        ],
        traditions: [
          { name: 'Rascal', description: 'Raccoon mascot' },
          { name: 'Train horn', description: 'Home run celebration' }
        ]
      },
      fanExperience: {
        atmosphere: 'Relaxed riverside baseball',
        bestExperiences: [
          'Walking bridge to stadium',
          'Skyline views at sunset',
          'Island entertainment options',
          'Friday fireworks'
        ],
        traditions: [
          'Train horn home runs',
          'Rascal\'s antics',
          'Government employee nights'
        ],
        mascot: {
          name: 'Rascal',
          description: 'Mischievous raccoon'
        }
      },
      proTips: {
        insiderTips: [
          'Park downtown and walk',
          'Explore City Island early',
          'Third base for best views',
          'Boardwalk unique experience'
        ],
        avoidThese: [
          'Island parking on fireworks nights',
          'First base in afternoon sun',
          'Leaving during bridge rush'
        ],
        hiddenGems: [
          'Pride of Susquehanna riverboat',
          'Beach volleyball courts',
          'Riverside walking path',
          'Mini golf next door'
        ],
        photoSpots: [
          'Bridge with stadium',
          'Skyline backdrop',
          'With Rascal',
          'Boardwalk views'
        ],
        bestValue: [
          'Lawn seating',
          'Thursday promotions',
          'Downtown parking'
        ]
      }
    },
};
