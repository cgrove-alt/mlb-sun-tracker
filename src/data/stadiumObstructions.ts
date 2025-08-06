// Comprehensive Stadium Obstruction Data
// Covers MLB, MiLB, and NFL stadiums with detailed 3D obstruction models

import { Obstruction, Vector3D } from '../utils/shadeCalculation3D';

// Helper to convert polar coordinates to 3D
function polarTo3D(
  angle: number, // degrees
  distance: number, // feet from center
  z: number // height
): Vector3D {
  const radians = angle * Math.PI / 180;
  return {
    x: distance * Math.cos(radians),
    y: distance * Math.sin(radians),
    z
  };
}

// MLB Stadium Obstructions
export const MLB_OBSTRUCTIONS: Record<string, Obstruction[]> = {
  'yankees': [
    {
      id: 'frieze-facade',
      type: 'structure',
      boundingBox: {
        min: { x: -200, y: 100, z: 90 },
        max: { x: 200, y: 120, z: 110 }
      },
      opacity: 0.7
    },
    {
      id: 'monument-park-overhang',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(315, 380, 15),
        max: polarTo3D(45, 410, 35)
      },
      opacity: 0.9
    }
  ],
  'redsox': [
    {
      id: 'green-monster',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(225, 310, 0),
        max: polarTo3D(270, 315, 37)
      },
      opacity: 1
    },
    {
      id: 'rf-roof-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(340, 280, 60),
        max: polarTo3D(20, 320, 85)
      },
      opacity: 0.8
    }
  ],
  'astros': [
    {
      id: 'train-track',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 400, 20),
        max: polarTo3D(315, 436, 40)
      },
      opacity: 0.8
    },
    {
      id: 'crawford-boxes',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(225, 280, 25),
        max: polarTo3D(270, 315, 45)
      },
      opacity: 0.85
    }
  ],
  'giants': [
    {
      id: 'coke-bottle',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 415, 0),
        max: polarTo3D(275, 420, 80)
      },
      opacity: 0.9
    },
    {
      id: 'arcade',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(20, 420, 0),
        max: polarTo3D(70, 450, 65)
      },
      opacity: 0.7
    }
  ],
  'dodgers': [
    {
      id: 'left-pavilion-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(200, 350, 55),
        max: polarTo3D(240, 400, 70)
      },
      opacity: 0.9
    },
    {
      id: 'right-pavilion-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(300, 350, 55),
        max: polarTo3D(340, 400, 70)
      },
      opacity: 0.9
    }
  ],
  'cubs': [
    {
      id: 'upper-deck-overhang',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(180, 200, 65),
        max: polarTo3D(360, 240, 80)
      },
      opacity: 0.85
    },
    {
      id: 'bleacher-boards',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 360, 0),
        max: polarTo3D(45, 380, 25)
      },
      opacity: 0.6
    }
  ],
  'mariners': [
    {
      id: 'roof-track-left',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(180, 200, 100),
        max: polarTo3D(220, 210, 115)
      },
      opacity: 0.7
    },
    {
      id: 'roof-track-right',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(320, 200, 100),
        max: polarTo3D(360, 210, 115)
      },
      opacity: 0.7
    }
  ],
  'rangers': [
    {
      id: 'home-run-porch',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(330, 300, 25),
        max: polarTo3D(30, 330, 45)
      },
      opacity: 0.8
    }
  ],
  'orioles': [
    {
      id: 'warehouse',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(30, 450, 0),
        max: polarTo3D(90, 500, 100)
      },
      opacity: 1
    }
  ],
  'cardinals': [
    {
      id: 'big-mac-land',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 350, 35),
        max: polarTo3D(290, 380, 55)
      },
      opacity: 0.75
    }
  ],
  'whitesox': [
    {
      id: 'fundamentals-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(315, 280, 40),
        max: polarTo3D(45, 320, 60)
      },
      opacity: 0.8
    }
  ],
  'phillies': [
    {
      id: 'ashburn-alley',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(315, 320, 45),
        max: polarTo3D(45, 360, 65)
      },
      opacity: 0.85
    }
  ],
  'nationals': [
    {
      id: 'red-porch',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 330, 25),
        max: polarTo3D(45, 370, 45)
      },
      opacity: 0.8
    }
  ],
  'braves': [
    {
      id: 'chop-house',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(30, 380, 30),
        max: polarTo3D(90, 420, 50)
      },
      opacity: 0.75
    }
  ],
  'mets': [
    {
      id: 'shea-bridge',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 380, 60),
        max: polarTo3D(45, 400, 75)
      },
      opacity: 0.7
    }
  ],
  'pirates': [
    {
      id: 'riverwalk',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(20, 320, 35),
        max: polarTo3D(90, 360, 55)
      },
      opacity: 0.8
    }
  ],
  'reds': [
    {
      id: 'riverboat-deck',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 380, 40),
        max: polarTo3D(45, 410, 60)
      },
      opacity: 0.75
    }
  ],
  'rockies': [
    {
      id: 'rock-pile',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 390, 20),
        max: polarTo3D(45, 420, 40)
      },
      opacity: 0.7
    }
  ],
  'padres': [
    {
      id: 'western-metal',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(210, 320, 0),
        max: polarTo3D(230, 335, 85)
      },
      opacity: 1
    },
    {
      id: 'park-at-park',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 380, 0),
        max: polarTo3D(45, 430, 30)
      },
      opacity: 0.5
    }
  ],
  'twins': [
    {
      id: 'overlook',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(330, 280, 55),
        max: polarTo3D(30, 320, 75)
      },
      opacity: 0.85
    }
  ],
  'royals': [
    {
      id: 'crown-vision',
      type: 'scoreboard',
      boundingBox: {
        min: polarTo3D(315, 400, 50),
        max: polarTo3D(45, 420, 100)
      },
      opacity: 0.9
    }
  ],
  'tigers': [
    {
      id: 'dugout-overhang',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(90, 100, 25),
        max: polarTo3D(270, 140, 40)
      },
      opacity: 0.8
    }
  ],
  'guardians': [
    {
      id: 'heritage-park',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 370, 25),
        max: polarTo3D(45, 410, 45)
      },
      opacity: 0.7
    }
  ],
  'rays': [
    {
      id: 'catwalk-a',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(0, 150, 85),
        max: polarTo3D(360, 180, 90)
      },
      opacity: 0.4
    },
    {
      id: 'catwalk-b',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(0, 220, 95),
        max: polarTo3D(360, 250, 100)
      },
      opacity: 0.4
    }
  ],
  'angels': [
    {
      id: 'rock-waterfall',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 370, 0),
        max: polarTo3D(45, 390, 55)
      },
      opacity: 0.7
    }
  ],
  'athletics': [
    {
      id: 'mt-davis',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 380, 0),
        max: polarTo3D(45, 450, 100)
      },
      opacity: 1
    }
  ],
  'bluejays': [
    {
      id: 'hotel-windows',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(315, 380, 80),
        max: polarTo3D(45, 400, 140)
      },
      opacity: 0.6
    }
  ],
  'brewers': [
    {
      id: 'bernie-brewer-slide',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 380, 20),
        max: polarTo3D(290, 400, 60)
      },
      opacity: 0.7
    }
  ],
  'diamondbacks': [
    {
      id: 'pool-area',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(30, 380, 0),
        max: polarTo3D(60, 415, 25)
      },
      opacity: 0.6
    }
  ],
  'marlins': [
    {
      id: 'home-run-sculpture',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 390, 20),
        max: polarTo3D(290, 410, 70)
      },
      opacity: 0.8
    }
  ]
};

// MiLB Stadium Obstructions (Triple-A and Double-A)
export const MILB_OBSTRUCTIONS: Record<string, Obstruction[]> = {
  // Triple-A stadiums
  'buffalo-bisons': [
    {
      id: 'upper-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(180, 180, 45),
        max: polarTo3D(360, 220, 65)
      },
      opacity: 0.85
    }
  ],
  'charlotte-knights': [
    {
      id: 'skyline-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(270, 280, 50),
        max: polarTo3D(90, 320, 70)
      },
      opacity: 0.8
    }
  ],
  'columbus-clippers': [
    {
      id: 'rooftop-terrace',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(30, 340, 35),
        max: polarTo3D(60, 380, 55)
      },
      opacity: 0.75
    }
  ],
  'durham-bulls': [
    {
      id: 'blue-monster',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(225, 305, 0),
        max: polarTo3D(245, 310, 32)
      },
      opacity: 1
    }
  ],
  'gwinnett-stripers': [
    {
      id: 'party-pavilion',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(30, 350, 25),
        max: polarTo3D(90, 390, 45)
      },
      opacity: 0.7
    }
  ],
  'indianapolis-indians': [
    {
      id: 'lawn-seating',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 360, 15),
        max: polarTo3D(90, 400, 35)
      },
      opacity: 0.6
    }
  ],
  'iowa-cubs': [
    {
      id: 'right-field-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(330, 280, 40),
        max: polarTo3D(30, 320, 60)
      },
      opacity: 0.8
    }
  ],
  'las-vegas-aviators': [
    {
      id: 'pool-beyond-rf',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(30, 380, 0),
        max: polarTo3D(60, 420, 20)
      },
      opacity: 0.5
    }
  ],
  'louisville-bats': [
    {
      id: 'pepsi-party-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(315, 320, 40),
        max: polarTo3D(45, 360, 60)
      },
      opacity: 0.75
    }
  ],
  'memphis-redbirds': [
    {
      id: 'bluff-seating',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 350, 30),
        max: polarTo3D(90, 390, 50)
      },
      opacity: 0.7
    }
  ],
  // Double-A stadiums
  'portland-sea-dogs': [
    {
      id: 'maine-monster',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(225, 315, 0),
        max: polarTo3D(245, 320, 37)
      },
      opacity: 1
    }
  ],
  'richmond-flying-squirrels': [
    {
      id: 'party-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(30, 320, 35),
        max: polarTo3D(90, 360, 55)
      },
      opacity: 0.75
    }
  ],
  'hartford-yard-goats': [
    {
      id: 'dunkin-park-deck',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(270, 280, 40),
        max: polarTo3D(90, 320, 60)
      },
      opacity: 0.8
    }
  ],
  'san-antonio-missions': [
    {
      id: 'berm-seating',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 360, 0),
        max: polarTo3D(90, 400, 20)
      },
      opacity: 0.5
    }
  ],
  'tulsa-drillers': [
    {
      id: 'oil-derrick',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(30, 380, 0),
        max: polarTo3D(35, 385, 60)
      },
      opacity: 0.7
    }
  ]
};

// NFL Stadium Obstructions
export const NFL_OBSTRUCTIONS: Record<string, Obstruction[]> = {
  // AFC Stadiums
  'highmark-stadium': [
    {
      id: 'upper-deck-overhang',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(90, 200, 60),
        max: polarTo3D(270, 250, 80)
      },
      opacity: 0.9
    }
  ],
  'hard-rock-stadium': [
    {
      id: 'canopy-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 180, 90),
        max: polarTo3D(360, 240, 110)
      },
      opacity: 0.85
    }
  ],
  'gillette-stadium': [
    {
      id: 'lighthouse',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(45, 380, 0),
        max: polarTo3D(50, 385, 120)
      },
      opacity: 1
    },
    {
      id: 'bridge-structure',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(0, 360, 80),
        max: polarTo3D(180, 370, 100)
      },
      opacity: 0.8
    }
  ],
  'metlife-stadium': [
    {
      id: 'upper-tier-overhang',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(0, 220, 70),
        max: polarTo3D(360, 270, 90)
      },
      opacity: 0.85
    }
  ],
  'paul-brown-stadium': [
    {
      id: 'club-level-overhang',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(90, 180, 50),
        max: polarTo3D(270, 220, 65)
      },
      opacity: 0.8
    }
  ],
  'm-and-t-bank-stadium': [
    {
      id: 'upper-deck-structure',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(0, 200, 65),
        max: polarTo3D(360, 250, 85)
      },
      opacity: 0.85
    }
  ],
  'acrisure-stadium': [
    {
      id: 'scoreboard-structure',
      type: 'scoreboard',
      boundingBox: {
        min: polarTo3D(315, 380, 40),
        max: polarTo3D(45, 400, 90)
      },
      opacity: 0.9
    }
  ],
  'cleveland-browns-stadium': [
    {
      id: 'dawg-pound-overhang',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(90, 180, 45),
        max: polarTo3D(270, 210, 60)
      },
      opacity: 0.75
    }
  ],
  'lucas-oil-stadium': [
    {
      id: 'retractable-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 100),
        max: polarTo3D(360, 300, 120)
      },
      opacity: 1
    }
  ],
  'nissan-stadium': [
    {
      id: 'upper-level-overhang',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(90, 190, 55),
        max: polarTo3D(270, 230, 75)
      },
      opacity: 0.8
    }
  ],
  'nrg-stadium': [
    {
      id: 'retractable-roof-panels',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 110),
        max: polarTo3D(360, 320, 130)
      },
      opacity: 1
    }
  ],
  'tiaa-bank-field': [
    {
      id: 'pools-cabanas',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(45, 360, 20),
        max: polarTo3D(135, 390, 40)
      },
      opacity: 0.7
    }
  ],
  'allegiant-stadium': [
    {
      id: 'translucent-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 100),
        max: polarTo3D(360, 350, 125)
      },
      opacity: 0.3
    }
  ],
  'empower-field': [
    {
      id: 'ring-of-fame',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(0, 280, 75),
        max: polarTo3D(360, 300, 85)
      },
      opacity: 0.6
    }
  ],
  'arrowhead-stadium': [
    {
      id: 'upper-deck-spiral',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(0, 210, 65),
        max: polarTo3D(360, 260, 85)
      },
      opacity: 0.85
    }
  ],
  'sofi-stadium': [
    {
      id: 'translucent-canopy',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 95),
        max: polarTo3D(360, 400, 115)
      },
      opacity: 0.4
    },
    {
      id: 'oculus-video-board',
      type: 'scoreboard',
      boundingBox: {
        min: polarTo3D(0, 150, 60),
        max: polarTo3D(360, 170, 80)
      },
      opacity: 0.9
    }
  ],
  // NFC Stadiums
  'at-t-stadium': [
    {
      id: 'retractable-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 110),
        max: polarTo3D(360, 380, 135)
      },
      opacity: 1
    },
    {
      id: 'center-video-board',
      type: 'scoreboard',
      boundingBox: {
        min: polarTo3D(90, 160, 50),
        max: polarTo3D(270, 180, 90)
      },
      opacity: 0.95
    }
  ],
  'lincoln-financial-field': [
    {
      id: 'upper-level-overhang',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(0, 200, 60),
        max: polarTo3D(360, 240, 80)
      },
      opacity: 0.85
    }
  ],
  'fedex-field': [
    {
      id: 'upper-deck-structure',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(90, 190, 55),
        max: polarTo3D(270, 230, 75)
      },
      opacity: 0.8
    }
  ],
  'soldier-field': [
    {
      id: 'colonnade-structure',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(0, 280, 0),
        max: polarTo3D(360, 300, 90)
      },
      opacity: 0.7
    }
  ],
  'ford-field': [
    {
      id: 'fixed-dome',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 95),
        max: polarTo3D(360, 320, 115)
      },
      opacity: 1
    }
  ],
  'lambeau-field': [
    {
      id: 'bowl-structure',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(0, 200, 60),
        max: polarTo3D(360, 250, 80)
      },
      opacity: 0.85
    }
  ],
  'us-bank-stadium': [
    {
      id: 'etfe-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 100),
        max: polarTo3D(360, 340, 120)
      },
      opacity: 0.4
    },
    {
      id: 'glass-panels',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(270, 300, 0),
        max: polarTo3D(360, 320, 100)
      },
      opacity: 0.3
    }
  ],
  'bank-of-america-stadium': [
    {
      id: 'upper-bowl-overhang',
      type: 'upper_deck',
      boundingBox: {
        min: polarTo3D(0, 190, 55),
        max: polarTo3D(360, 230, 75)
      },
      opacity: 0.8
    }
  ],
  'mercedes-benz-superdome': [
    {
      id: 'dome-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 90),
        max: polarTo3D(360, 320, 110)
      },
      opacity: 1
    }
  ],
  'raymond-james-stadium': [
    {
      id: 'pirate-ship',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(45, 360, 0),
        max: polarTo3D(75, 390, 50)
      },
      opacity: 0.8
    }
  ],
  'mercedes-benz-stadium': [
    {
      id: 'retractable-petals',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 105),
        max: polarTo3D(360, 350, 125)
      },
      opacity: 0.9
    },
    {
      id: 'halo-board',
      type: 'scoreboard',
      boundingBox: {
        min: polarTo3D(0, 260, 70),
        max: polarTo3D(360, 280, 90)
      },
      opacity: 0.85
    }
  ],
  'state-farm-stadium': [
    {
      id: 'retractable-roof',
      type: 'roof',
      boundingBox: {
        min: polarTo3D(0, 0, 100),
        max: polarTo3D(360, 340, 120)
      },
      opacity: 1
    }
  ],
  'levis-stadium': [
    {
      id: 'suite-tower',
      type: 'structure',
      boundingBox: {
        min: polarTo3D(180, 250, 40),
        max: polarTo3D(360, 290, 80)
      },
      opacity: 0.85
    }
  ],
  'lumen-field': [
    {
      id: 'hawks-nest',
      type: 'overhang',
      boundingBox: {
        min: polarTo3D(45, 280, 70),
        max: polarTo3D(135, 320, 90)
      },
      opacity: 0.9
    }
  ]
};

// Get obstructions for any stadium
export function getStadiumObstructions(stadiumId: string): Obstruction[] {
  // Check MLB first
  if (MLB_OBSTRUCTIONS[stadiumId]) {
    return MLB_OBSTRUCTIONS[stadiumId];
  }
  
  // Check MiLB
  if (MILB_OBSTRUCTIONS[stadiumId]) {
    return MILB_OBSTRUCTIONS[stadiumId];
  }
  
  // Check NFL
  if (NFL_OBSTRUCTIONS[stadiumId]) {
    return NFL_OBSTRUCTIONS[stadiumId];
  }
  
  // Return empty array if not found
  return [];
}

// Get all obstructions by type
export function getAllObstructionsByType(stadiumType: 'MLB' | 'MiLB' | 'NFL'): Record<string, Obstruction[]> {
  switch (stadiumType) {
    case 'MLB':
      return MLB_OBSTRUCTIONS;
    case 'MiLB':
      return MILB_OBSTRUCTIONS;
    case 'NFL':
      return NFL_OBSTRUCTIONS;
    default:
      return {};
  }
}