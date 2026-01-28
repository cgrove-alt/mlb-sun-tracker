// Fenway Park - 3D Obstruction Models
// Comprehensive obstruction data for accurate shadow calculations

import { Obstruction3D, Vector3D, Mesh3D } from '../../../types/stadium-complete';

// Helper to create box mesh
function createBoxMesh(min: Vector3D, max: Vector3D): Mesh3D {
  const vertices: Vector3D[] = [
    // Bottom face
    { x: min.x, y: min.y, z: min.z },
    { x: max.x, y: min.y, z: min.z },
    { x: max.x, y: max.y, z: min.z },
    { x: min.x, y: max.y, z: min.z },
    // Top face
    { x: min.x, y: min.y, z: max.z },
    { x: max.x, y: min.y, z: max.z },
    { x: max.x, y: max.y, z: max.z },
    { x: min.x, y: max.y, z: max.z }
  ];
  
  const faces = [
    [0, 1, 2, 3], // Bottom
    [4, 7, 6, 5], // Top
    [0, 4, 5, 1], // Front
    [2, 6, 7, 3], // Back
    [0, 3, 7, 4], // Left
    [1, 5, 6, 2]  // Right
  ];
  
  return { vertices, faces };
}

export const redsoxObstructions: Obstruction3D[] = [
  {
    id: 'green_monster',
    name: 'Green Monster (Left Field Wall)',
    type: 'structure',
    geometry: {
      vertices: [
        // Bottom vertices (ground level at ~310ft from home)
        { x: -110, y: 145, z: 0 },
        { x: -50, y: 180, z: 0 },
        { x: -50, y: 182, z: 0 },
        { x: -110, y: 147, z: 0 },
        // Top vertices (37ft high)
        { x: -110, y: 145, z: 37 },
        { x: -50, y: 180, z: 37 },
        { x: -50, y: 182, z: 37 },
        { x: -110, y: 147, z: 37 }
      ],
      faces: [
        [0, 1, 2, 3], // Bottom
        [4, 7, 6, 5], // Top
        [0, 4, 5, 1], // Front (field side)
        [2, 6, 7, 3], // Back
        [0, 3, 7, 4], // Left end
        [1, 5, 6, 2]  // Right end
      ]
    },
    boundingBox: {
      min: { x: -110, y: 145, z: 0 },
      max: { x: -50, y: 182, z: 37 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.2,
      color: '#2F5233' // Green Monster green
    },
    castsShadow: true
  },
  {
    id: 'green_monster_scoreboard',
    name: 'Green Monster Manual Scoreboard',
    type: 'scoreboard',
    geometry: {
      vertices: [
        { x: -85, y: 150, z: 20 },
        { x: -70, y: 155, z: 20 },
        { x: -70, y: 155, z: 35 },
        { x: -85, y: 150, z: 35 },
        { x: -85, y: 152, z: 20 },
        { x: -70, y: 157, z: 20 },
        { x: -70, y: 157, z: 35 },
        { x: -85, y: 152, z: 35 }
      ],
      faces: [
        [0, 1, 2, 3],
        [4, 7, 6, 5],
        [0, 4, 5, 1],
        [2, 6, 7, 3],
        [0, 3, 7, 4],
        [1, 5, 6, 2]
      ]
    },
    boundingBox: {
      min: { x: -85, y: 150, z: 20 },
      max: { x: -70, y: 157, z: 35 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.1,
      color: '#2F5233'
    },
    castsShadow: true
  },
  {
    id: 'pesky_pole',
    name: "Pesky's Pole (Right Field Foul Pole)",
    type: 'structure',
    geometry: {
      vertices: [
        { x: 95, y: 108, z: 0 },
        { x: 96, y: 108, z: 0 },
        { x: 96, y: 109, z: 0 },
        { x: 95, y: 109, z: 0 },
        { x: 95, y: 108, z: 40 },
        { x: 96, y: 108, z: 40 },
        { x: 96, y: 109, z: 40 },
        { x: 95, y: 109, z: 40 }
      ],
      faces: [
        [0, 1, 2, 3],
        [4, 7, 6, 5],
        [0, 4, 5, 1],
        [2, 6, 7, 3],
        [0, 3, 7, 4],
        [1, 5, 6, 2]
      ]
    },
    boundingBox: {
      min: { x: 95, y: 108, z: 0 },
      max: { x: 96, y: 109, z: 40 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#FFD700' // Yellow foul pole
    },
    castsShadow: true
  },
  {
    id: 'upper_deck_home',
    name: 'Upper Deck Overhang - Home Plate',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: -65,
          y: 95,
          z: 55
        },
        {
          x: 65,
          y: 95,
          z: 55
        },
        {
          x: 65,
          y: 135,
          z: 55
        },
        {
          x: -65,
          y: 135,
          z: 55
        },
        {
          x: -65,
          y: 95,
          z: 60
        },
        {
          x: 65,
          y: 95,
          z: 60
        },
        {
          x: 65,
          y: 135,
          z: 60
        },
        {
          x: -65,
          y: 135,
          z: 60
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: -65,
        y: 95,
        z: 55
      }, max: {
        x: 65,
        y: 135,
        z: 60
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'upper_deck_1b',
    name: 'Upper Deck Overhang - First Base',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: 60,
          y: 90,
          z: 50
        },
        {
          x: 150,
          y: 90,
          z: 50
        },
        {
          x: 150,
          y: 130,
          z: 50
        },
        {
          x: 60,
          y: 130,
          z: 50
        },
        {
          x: 60,
          y: 90,
          z: 180
        },
        {
          x: 150,
          y: 90,
          z: 180
        },
        {
          x: 150,
          y: 130,
          z: 180
        },
        {
          x: 60,
          y: 130,
          z: 180
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: 60,
        y: 90,
        z: 50
      }, max: {
        x: 150,
        y: 130,
        z: 180
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'upper_deck_3b',
    name: 'Upper Deck Overhang - Third Base',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: -150,
          y: 90,
          z: 50
        },
        {
          x: -60,
          y: 90,
          z: 50
        },
        {
          x: -60,
          y: 130,
          z: 50
        },
        {
          x: -150,
          y: 130,
          z: 50
        },
        {
          x: -150,
          y: 90,
          z: 180
        },
        {
          x: -60,
          y: 90,
          z: 180
        },
        {
          x: -60,
          y: 130,
          z: 180
        },
        {
          x: -150,
          y: 130,
          z: 180
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: -150,
        y: 90,
        z: 50
      }, max: {
        x: -60,
        y: 130,
        z: 180
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'main_scoreboard',
    name: 'Main Scoreboard',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -40,
          y: 40,
          z: 400
        },
        {
          x: 40,
          y: 40,
          z: 400
        },
        {
          x: 40,
          y: 120,
          z: 400
        },
        {
          x: -40,
          y: 120,
          z: 400
        },
        {
          x: -40,
          y: 40,
          z: 410
        },
        {
          x: 40,
          y: 40,
          z: 410
        },
        {
          x: 40,
          y: 120,
          z: 410
        },
        {
          x: -40,
          y: 120,
          z: 410
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: -40,
        y: 40,
        z: 400
      }, max: {
        x: 40,
        y: 120,
        z: 410
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_tower_1',
    name: 'Light Tower 1',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: 115,
          y: 0,
          z: 115
        },
        {
          x: 125,
          y: 0,
          z: 115
        },
        {
          x: 125,
          y: 150,
          z: 115
        },
        {
          x: 115,
          y: 150,
          z: 115
        },
        {
          x: 115,
          y: 0,
          z: 125
        },
        {
          x: 125,
          y: 0,
          z: 125
        },
        {
          x: 125,
          y: 150,
          z: 125
        },
        {
          x: 115,
          y: 150,
          z: 125
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: 115,
        y: 0,
        z: 115
      }, max: {
        x: 125,
        y: 150,
        z: 125
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_tower_2',
    name: 'Light Tower 2',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -125,
          y: 0,
          z: 115
        },
        {
          x: -115,
          y: 0,
          z: 115
        },
        {
          x: -115,
          y: 150,
          z: 115
        },
        {
          x: -125,
          y: 150,
          z: 115
        },
        {
          x: -125,
          y: 0,
          z: 125
        },
        {
          x: -115,
          y: 0,
          z: 125
        },
        {
          x: -115,
          y: 150,
          z: 125
        },
        {
          x: -125,
          y: 150,
          z: 125
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: -125,
        y: 0,
        z: 115
      }, max: {
        x: -115,
        y: 150,
        z: 125
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_tower_3',
    name: 'Light Tower 3',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: 95,
          y: 0,
          z: 345
        },
        {
          x: 105,
          y: 0,
          z: 345
        },
        {
          x: 105,
          y: 150,
          z: 345
        },
        {
          x: 95,
          y: 150,
          z: 345
        },
        {
          x: 95,
          y: 0,
          z: 355
        },
        {
          x: 105,
          y: 0,
          z: 355
        },
        {
          x: 105,
          y: 150,
          z: 355
        },
        {
          x: 95,
          y: 150,
          z: 355
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: 95,
        y: 0,
        z: 345
      }, max: {
        x: 105,
        y: 150,
        z: 355
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_tower_4',
    name: 'Light Tower 4',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -105,
          y: 0,
          z: 345
        },
        {
          x: -95,
          y: 0,
          z: 345
        },
        {
          x: -95,
          y: 150,
          z: 345
        },
        {
          x: -105,
          y: 150,
          z: 345
        },
        {
          x: -105,
          y: 0,
          z: 355
        },
        {
          x: -95,
          y: 0,
          z: 355
        },
        {
          x: -95,
          y: 150,
          z: 355
        },
        {
          x: -105,
          y: 150,
          z: 355
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: -105,
        y: 0,
        z: 345
      }, max: {
        x: -95,
        y: 150,
        z: 355
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'press_box',
    name: 'Press Box / Luxury Suites',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -50,
          y: 80,
          z: 30
        },
        {
          x: 50,
          y: 80,
          z: 30
        },
        {
          x: 50,
          y: 110,
          z: 30
        },
        {
          x: -50,
          y: 110,
          z: 30
        },
        {
          x: -50,
          y: 80,
          z: 40
        },
        {
          x: 50,
          y: 80,
          z: 40
        },
        {
          x: 50,
          y: 110,
          z: 40
        },
        {
          x: -50,
          y: 110,
          z: 40
        }
      ],
      'faces': [
        [
          0,
          1,
          2,
          3
        ],
        [
          4,
          7,
          6,
          5
        ],
        [
          0,
          4,
          5,
          1
        ],
        [
          2,
          6,
          7,
          3
        ],
        [
          0,
          3,
          7,
          4
        ],
        [
          1,
          5,
          6,
          2
        ]
      ]
    },
    'boundingBox': { min: {
        x: -50,
        y: 80,
        z: 30
      }, max: {
        x: 50,
        y: 110,
        z: 40
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  }
];

// Export for use in stadium data aggregator
export default redsoxObstructions;
