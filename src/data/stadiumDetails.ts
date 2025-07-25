export interface StadiumHistory {
  opened: number;
  previousNames?: string[];
  renovations?: { year: number; description: string }[];
  shadeFeatures?: { year: number; feature: string }[];
  funFacts?: string[];
}

export const stadiumHistories: Record<string, StadiumHistory> = {
  'angels': {
    opened: 1966,
    previousNames: ['Anaheim Stadium', 'Edison International Field'],
    renovations: [
      { year: 1979, description: 'Enclosed stadium for NFL' },
      { year: 1998, description: 'Restored to baseball-only configuration' }
    ],
    shadeFeatures: [
      { year: 1998, feature: 'Added club level overhang for shade' },
      { year: 2011, feature: 'Installed sun shades in outfield pavilion' }
    ],
    funFacts: [
      'The Big A sign provides minimal shade but is an iconic landmark',
      'Third base side gets afternoon shade first'
    ]
  },
  'orioles': {
    opened: 1992,
    shadeFeatures: [
      { year: 1992, feature: 'Designed with upper deck overhang for shade' },
      { year: 2011, feature: 'Added party deck with shade structures' }
    ],
    funFacts: [
      'First of the "retro" ballparks with classic design',
      'Upper deck provides excellent shade for lower sections'
    ]
  },
  'redsox': {
    opened: 1912,
    renovations: [
      { year: 2003, description: 'Green Monster seats added' },
      { year: 2008, description: 'New seating and concourse improvements' }
    ],
    shadeFeatures: [
      { year: 1934, feature: 'Roof boxes added above grandstand' },
      { year: 1988, feature: 'Club level added with shade overhang' }
    ],
    funFacts: [
      'Oldest ballpark in MLB',
      'Grandstand roof provides classic shade pattern',
      'Green Monster creates unique shadow in left field'
    ]
  },
  'yankees': {
    opened: 2009,
    previousNames: ['New Yankee Stadium'],
    shadeFeatures: [
      { year: 2009, feature: 'Designed with extensive upper deck overhang' },
      { year: 2009, feature: 'Suite level provides mid-level shade' }
    ],
    funFacts: [
      'Replaced the original Yankee Stadium (1923-2008)',
      'Monument Park is fully shaded',
      'Frieze facade provides additional shade'
    ]
  },
  'rays': {
    opened: 1990,
    previousNames: ['Florida Suncoast Dome', 'Thunderdome'],
    shadeFeatures: [
      { year: 1990, feature: 'Fixed dome provides complete sun protection' }
    ],
    funFacts: [
      'Only fixed-dome stadium in MLB',
      'No sun exposure concerns at any time',
      'Catwalks can create interesting shadow patterns from artificial lighting'
    ]
  },
  'whitesox': {
    opened: 1991,
    previousNames: ['New Comiskey Park', 'U.S. Cellular Field'],
    renovations: [
      { year: 2001, description: 'Major renovation reduced upper deck' }
    ],
    shadeFeatures: [
      { year: 2001, feature: 'New upper deck design improved shade coverage' },
      { year: 2016, feature: 'Added shade canopies to club level' }
    ],
    funFacts: [
      'Upper deck provides good shade for lower bowl',
      'Fundamentally different after 2001 renovation'
    ]
  },
  'guardians': {
    opened: 1994,
    previousNames: ['Jacobs Field'],
    shadeFeatures: [
      { year: 1994, feature: 'Designed with shade-providing upper decks' },
      { year: 2015, feature: 'Added terrace club with covered seating' }
    ],
    funFacts: [
      'Intimate design brings shade closer to field',
      'Home plate area gets shade earliest'
    ]
  },
  'tigers': {
    opened: 2000,
    shadeFeatures: [
      { year: 2000, feature: 'Upper deck overhang designed for shade' },
      { year: 2005, feature: 'Added Pepsi Porch with shade structure' }
    ],
    funFacts: [
      'Replaced historic Tiger Stadium',
      'Statues create small shaded gathering areas',
      'Third base side preferred for afternoon shade'
    ]
  },
  'astros': {
    opened: 2000,
    previousNames: ['Enron Field'],
    shadeFeatures: [
      { year: 2000, feature: 'Retractable roof for complete sun control' }
    ],
    funFacts: [
      'Roof typically closed for day games',
      'When open, provides unique shade patterns',
      'Train track has covered viewing area'
    ]
  },
  'royals': {
    opened: 1973,
    renovations: [
      { year: 2009, description: 'Major renovation added modern amenities' }
    ],
    shadeFeatures: [
      { year: 2009, feature: 'New upper deck design improved shade' },
      { year: 2009, feature: 'Added shaded party areas in outfield' }
    ],
    funFacts: [
      'Crown-shaped scoreboard creates unique shadows',
      'Fountains provide cooling effect on hot days'
    ]
  },
  'athletics': {
    opened: 1966,
    previousNames: ['Oakland-Alameda County Coliseum'],
    renovations: [
      { year: 1996, description: 'Mount Davis added for Raiders' }
    ],
    shadeFeatures: [
      { year: 1966, feature: 'Original concrete overhang design' },
      { year: 1996, feature: 'Mount Davis provides extensive shade' }
    ],
    funFacts: [
      'Mount Davis blocks sun for many sections',
      'Concrete architecture provides reliable shade patterns'
    ]
  },
  'mariners': {
    opened: 1999,
    previousNames: ['Safeco Field'],
    shadeFeatures: [
      { year: 1999, feature: 'Retractable roof for weather protection' }
    ],
    funFacts: [
      'Roof usually open for sunny games',
      'Unique umbrella-style roof creates interesting shadows',
      'Third base side gets afternoon shade first'
    ]
  },
  'rangers': {
    opened: 2020,
    shadeFeatures: [
      { year: 2020, feature: 'Retractable roof with air conditioning' }
    ],
    funFacts: [
      'Newest ballpark in MLB',
      'Designed specifically to combat Texas heat',
      'Roof typically closed for all summer day games'
    ]
  },
  'twins': {
    opened: 2010,
    shadeFeatures: [
      { year: 2010, feature: 'Limestone overhang provides natural shade' },
      { year: 2010, feature: 'Canopy over main plaza' }
    ],
    funFacts: [
      'Replaced indoor Metrodome',
      'Limestone from local quarries',
      'Upper deck provides excellent shade coverage'
    ]
  },
  'bluejays': {
    opened: 1989,
    previousNames: ['SkyDome'],
    shadeFeatures: [
      { year: 1989, feature: 'Retractable roof - first of its kind' }
    ],
    funFacts: [
      'World\'s first retractable roof stadium',
      'Hotel windows overlook field',
      'Roof takes 20 minutes to open/close'
    ]
  },
  'braves': {
    opened: 2017,
    previousNames: ['SunTrust Park'],
    shadeFeatures: [
      { year: 2017, feature: 'Modern canopy design for shade' },
      { year: 2017, feature: 'Shaded plaza and gathering areas' }
    ],
    funFacts: [
      'Replaced Turner Field',
      'Designed with Georgia heat in mind',
      'Chop House provides shaded viewing'
    ]
  },
  'marlins': {
    opened: 2012,
    previousNames: ['Marlins Park'],
    shadeFeatures: [
      { year: 2012, feature: 'Retractable roof with glass panels' }
    ],
    funFacts: [
      'Roof designed to handle hurricanes',
      'Glass panels allow natural light when closed',
      'Home run sculpture removed in 2019'
    ]
  },
  'mets': {
    opened: 2009,
    shadeFeatures: [
      { year: 2009, feature: 'Open-air design with strategic overhangs' },
      { year: 2009, feature: 'Shaded concourse areas' }
    ],
    funFacts: [
      'Replaced Shea Stadium',
      'Jackie Robinson Rotunda provides gathering shade',
      'Designed to channel cooling breezes'
    ]
  },
  'phillies': {
    opened: 2004,
    shadeFeatures: [
      { year: 2004, feature: 'Upper deck overhang for lower level shade' },
      { year: 2004, feature: 'Shaded concourse and plaza areas' }
    ],
    funFacts: [
      'Replaced Veterans Stadium',
      'Ashburn Alley provides shaded concessions',
      'Third base side preferred for day games'
    ]
  },
  'nationals': {
    opened: 2008,
    shadeFeatures: [
      { year: 2008, feature: 'Modern overhang design' },
      { year: 2018, feature: 'Added shade structures to concourse' }
    ],
    funFacts: [
      'First LEED-certified green stadium',
      'Racing presidents provide entertainment',
      'Upper deck provides good lower bowl shade'
    ]
  },
  'pirates': {
    opened: 2001,
    shadeFeatures: [
      { year: 2001, feature: 'Classic steel truss overhang' },
      { year: 2015, feature: 'Added cocktail terrace with shade' }
    ],
    funFacts: [
      'Best skyline view in baseball',
      'Roberto Clemente Bridge provides pre-game shade',
      'Riverwalk has shaded areas'
    ]
  },
  'cardinals': {
    opened: 2006,
    previousNames: ['New Busch Stadium'],
    shadeFeatures: [
      { year: 2006, feature: 'Traditional overhang design' },
      { year: 2014, feature: 'Added rooftop deck with shade options' }
    ],
    funFacts: [
      'Replaced old Busch Stadium',
      'Ballpark Village provides shaded viewing',
      'Classic design with modern amenities'
    ]
  },
  'padres': {
    opened: 2004,
    shadeFeatures: [
      { year: 2004, feature: 'Limited overhang by design for SD weather' },
      { year: 2016, feature: 'Added shade sails to upper deck' }
    ],
    funFacts: [
      'Western Metal Supply Co. building integrated into design',
      'Park at the Park provides lawn seating',
      'Mild San Diego weather reduces shade needs'
    ]
  },
  'giants': {
    opened: 2000,
    previousNames: ['Pacific Bell Park', 'SBC Park', 'AT&T Park'],
    shadeFeatures: [
      { year: 2000, feature: 'Strategic overhang placement' },
      { year: 2019, feature: 'Added shade structures to Coca-Cola Fan Lot' }
    ],
    funFacts: [
      'McCovey Cove for home run balls',
      'Fog can provide natural sun blocking',
      'Third base side gets afternoon shade'
    ]
  },
  'rockies': {
    opened: 1995,
    shadeFeatures: [
      { year: 1995, feature: 'Upper deck designed for shade coverage' },
      { year: 2014, feature: 'Added rooftop deck with shade structures' }
    ],
    funFacts: [
      'Highest elevation stadium in MLB',
      'Purple row marks exactly one mile high',
      'Intense sun at altitude makes shade valuable'
    ]
  },
  'diamondbacks': {
    opened: 1998,
    previousNames: ['Bank One Ballpark'],
    shadeFeatures: [
      { year: 1998, feature: 'Retractable roof essential for Phoenix heat' }
    ],
    funFacts: [
      'First stadium with retractable roof and real grass',
      'Pool in right field',
      'Roof almost always closed for summer games'
    ]
  },
  'dodgers': {
    opened: 1962,
    renovations: [
      { year: 2000, description: 'Added field level seats' },
      { year: 2020, description: 'Center field plaza renovations' }
    ],
    shadeFeatures: [
      { year: 1962, feature: 'Original cantilevered roof design' },
      { year: 2000, feature: 'Club level added with shade benefits' }
    ],
    funFacts: [
      'Third oldest ballpark in MLB',
      'Built into Chavez Ravine',
      'Pavilions can get very hot without shade'
    ]
  },
  'reds': {
    opened: 2003,
    shadeFeatures: [
      { year: 2003, feature: 'Traditional overhang design' },
      { year: 2015, feature: 'Added party decks with shade options' }
    ],
    funFacts: [
      'Replaced Riverfront Stadium',
      'Smokestacks from hit batters',
      'Upper deck provides good shade coverage'
    ]
  },
  'brewers': {
    opened: 2001,
    previousNames: ['Miller Park'],
    shadeFeatures: [
      { year: 2001, feature: 'Fan-shaped retractable roof' }
    ],
    funFacts: [
      'Unique fan-shaped roof design',
      'Bernie Brewer\'s slide',
      'Roof typically open for nice weather'
    ]
  },
  'cubs': {
    opened: 1914,
    renovations: [
      { year: 1937, description: 'Bleachers and scoreboard added' },
      { year: 2015, description: 'Major renovation project began' }
    ],
    shadeFeatures: [
      { year: 1989, feature: 'Lights added (limited shade impact)' },
      { year: 2019, feature: 'New upper deck with shade considerations' }
    ],
    funFacts: [
      'Second oldest ballpark in MLB',
      'Ivy-covered outfield walls',
      'Rooftop clubs across the street',
      'Upper deck expansion improved shade options'
    ]
  }
};