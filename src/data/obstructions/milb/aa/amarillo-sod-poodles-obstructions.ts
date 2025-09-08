// HODGETOWN - 3D Obstruction Models
// Comprehensive obstruction data for accurate shadow calculations

import { Obstruction3D, Vector3D, Mesh3D } from '../../../../types/stadium-complete';

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

export const amarillosodpoodlesObstructions: Obstruction3D[] = [
  {
    id: 'upper_deck_home',
    name: 'Upper Deck - Home Plate',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: -33.75,
          y: 45,
          z: 30
        },
        {
          x: 33.75,
          y: 45,
          z: 30
        },
        {
          x: 33.75,
          y: 67.5,
          z: 30
        },
        {
          x: -33.75,
          y: 67.5,
          z: 30
        },
        {
          x: -33.75,
          y: 45,
          z: 33.75
        },
        {
          x: 33.75,
          y: 45,
          z: 33.75
        },
        {
          x: 33.75,
          y: 67.5,
          z: 33.75
        },
        {
          x: -33.75,
          y: 67.5,
          z: 33.75
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
        x: -33.75,
        y: 45,
        z: 30
      }, max: {
        x: 33.75,
        y: 67.5,
        z: 33.75
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'scoreboard',
    name: 'Scoreboard',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -18.75,
          y: 18.75,
          z: 240
        },
        {
          x: 18.75,
          y: 18.75,
          z: 240
        },
        {
          x: 18.75,
          y: 56.25,
          z: 240
        },
        {
          x: -18.75,
          y: 56.25,
          z: 240
        },
        {
          x: -18.75,
          y: 18.75,
          z: 243.75
        },
        {
          x: 18.75,
          y: 18.75,
          z: 243.75
        },
        {
          x: 18.75,
          y: 56.25,
          z: 243.75
        },
        {
          x: -18.75,
          y: 56.25,
          z: 243.75
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
        x: -18.75,
        y: 18.75,
        z: 240
      }, max: {
        x: 18.75,
        y: 56.25,
        z: 243.75
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_1',
    name: 'Light Standard 1',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: 184.5,
          y: 0,
          z: -3
        },
        {
          x: 190.5,
          y: 0,
          z: -3
        },
        {
          x: 190.5,
          y: 75,
          z: -3
        },
        {
          x: 184.5,
          y: 75,
          z: -3
        },
        {
          x: 184.5,
          y: 0,
          z: 3
        },
        {
          x: 190.5,
          y: 0,
          z: 3
        },
        {
          x: 190.5,
          y: 75,
          z: 3
        },
        {
          x: 184.5,
          y: 75,
          z: 3
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
        x: 184.5,
        y: 0,
        z: -3
      }, max: {
        x: 190.5,
        y: 75,
        z: 3
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_2',
    name: 'Light Standard 2',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -2.9999999999999885,
          y: 0,
          z: 184.5
        },
        {
          x: 3.0000000000000115,
          y: 0,
          z: 184.5
        },
        {
          x: 3.0000000000000115,
          y: 75,
          z: 184.5
        },
        {
          x: -2.9999999999999885,
          y: 75,
          z: 184.5
        },
        {
          x: -2.9999999999999885,
          y: 0,
          z: 190.5
        },
        {
          x: 3.0000000000000115,
          y: 0,
          z: 190.5
        },
        {
          x: 3.0000000000000115,
          y: 75,
          z: 190.5
        },
        {
          x: -2.9999999999999885,
          y: 75,
          z: 190.5
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
        x: -2.9999999999999885,
        y: 0,
        z: 184.5
      }, max: {
        x: 3.0000000000000115,
        y: 75,
        z: 190.5
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_3',
    name: 'Light Standard 3',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -190.5,
          y: 0,
          z: -2.999999999999977
        },
        {
          x: -184.5,
          y: 0,
          z: -2.999999999999977
        },
        {
          x: -184.5,
          y: 75,
          z: -2.999999999999977
        },
        {
          x: -190.5,
          y: 75,
          z: -2.999999999999977
        },
        {
          x: -190.5,
          y: 0,
          z: 3.000000000000023
        },
        {
          x: -184.5,
          y: 0,
          z: 3.000000000000023
        },
        {
          x: -184.5,
          y: 75,
          z: 3.000000000000023
        },
        {
          x: -190.5,
          y: 75,
          z: 3.000000000000023
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
        x: -190.5,
        y: 0,
        z: -2.999999999999977
      }, max: {
        x: -184.5,
        y: 75,
        z: 3.000000000000023
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'light_4',
    name: 'Light Standard 4',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -3.0000000000000346,
          y: 0,
          z: -190.5
        },
        {
          x: 2.9999999999999654,
          y: 0,
          z: -190.5
        },
        {
          x: 2.9999999999999654,
          y: 75,
          z: -190.5
        },
        {
          x: -3.0000000000000346,
          y: 75,
          z: -190.5
        },
        {
          x: -3.0000000000000346,
          y: 0,
          z: -184.5
        },
        {
          x: 2.9999999999999654,
          y: 0,
          z: -184.5
        },
        {
          x: 2.9999999999999654,
          y: 75,
          z: -184.5
        },
        {
          x: -3.0000000000000346,
          y: 75,
          z: -184.5
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
        x: -3.0000000000000346,
        y: 0,
        z: -190.5
      }, max: {
        x: 2.9999999999999654,
        y: 75,
        z: -184.5
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
export default amarillosodpoodlesObstructions;
