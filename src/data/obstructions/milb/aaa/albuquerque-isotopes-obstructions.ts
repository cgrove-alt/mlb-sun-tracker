// Isotopes Park - 3D Obstruction Models
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

export const albuquerqueisotopesObstructions: Obstruction3D[] = [
  {
    id: 'upper_deck_home',
    name: 'Upper Deck - Home Plate',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: -38.25,
          y: 51,
          z: 34
        },
        {
          x: 38.25,
          y: 51,
          z: 34
        },
        {
          x: 38.25,
          y: 76.5,
          z: 34
        },
        {
          x: -38.25,
          y: 76.5,
          z: 34
        },
        {
          x: -38.25,
          y: 51,
          z: 38.25
        },
        {
          x: 38.25,
          y: 51,
          z: 38.25
        },
        {
          x: 38.25,
          y: 76.5,
          z: 38.25
        },
        {
          x: -38.25,
          y: 76.5,
          z: 38.25
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
        x: -38.25,
        y: 51,
        z: 34
      }, max: {
        x: 38.25,
        y: 76.5,
        z: 38.25
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
          x: -21.25,
          y: 21.25,
          z: 272
        },
        {
          x: 21.25,
          y: 21.25,
          z: 272
        },
        {
          x: 21.25,
          y: 63.75,
          z: 272
        },
        {
          x: -21.25,
          y: 63.75,
          z: 272
        },
        {
          x: -21.25,
          y: 21.25,
          z: 276.25
        },
        {
          x: 21.25,
          y: 21.25,
          z: 276.25
        },
        {
          x: 21.25,
          y: 63.75,
          z: 276.25
        },
        {
          x: -21.25,
          y: 63.75,
          z: 276.25
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
        x: -21.25,
        y: 21.25,
        z: 272
      }, max: {
        x: 21.25,
        y: 63.75,
        z: 276.25
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
          x: 209.5,
          y: 0,
          z: -3
        },
        {
          x: 215.5,
          y: 0,
          z: -3
        },
        {
          x: 215.5,
          y: 85,
          z: -3
        },
        {
          x: 209.5,
          y: 85,
          z: -3
        },
        {
          x: 209.5,
          y: 0,
          z: 3
        },
        {
          x: 215.5,
          y: 0,
          z: 3
        },
        {
          x: 215.5,
          y: 85,
          z: 3
        },
        {
          x: 209.5,
          y: 85,
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
        x: 209.5,
        y: 0,
        z: -3
      }, max: {
        x: 215.5,
        y: 85,
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
          x: -2.999999999999987,
          y: 0,
          z: 209.5
        },
        {
          x: 3.000000000000013,
          y: 0,
          z: 209.5
        },
        {
          x: 3.000000000000013,
          y: 85,
          z: 209.5
        },
        {
          x: -2.999999999999987,
          y: 85,
          z: 209.5
        },
        {
          x: -2.999999999999987,
          y: 0,
          z: 215.5
        },
        {
          x: 3.000000000000013,
          y: 0,
          z: 215.5
        },
        {
          x: 3.000000000000013,
          y: 85,
          z: 215.5
        },
        {
          x: -2.999999999999987,
          y: 85,
          z: 215.5
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
        x: -2.999999999999987,
        y: 0,
        z: 209.5
      }, max: {
        x: 3.000000000000013,
        y: 85,
        z: 215.5
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
          x: -215.5,
          y: 0,
          z: -2.999999999999974
        },
        {
          x: -209.5,
          y: 0,
          z: -2.999999999999974
        },
        {
          x: -209.5,
          y: 85,
          z: -2.999999999999974
        },
        {
          x: -215.5,
          y: 85,
          z: -2.999999999999974
        },
        {
          x: -215.5,
          y: 0,
          z: 3.000000000000026
        },
        {
          x: -209.5,
          y: 0,
          z: 3.000000000000026
        },
        {
          x: -209.5,
          y: 85,
          z: 3.000000000000026
        },
        {
          x: -215.5,
          y: 85,
          z: 3.000000000000026
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
        x: -215.5,
        y: 0,
        z: -2.999999999999974
      }, max: {
        x: -209.5,
        y: 85,
        z: 3.000000000000026
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
          x: -3.000000000000039,
          y: 0,
          z: -215.5
        },
        {
          x: 2.999999999999961,
          y: 0,
          z: -215.5
        },
        {
          x: 2.999999999999961,
          y: 85,
          z: -215.5
        },
        {
          x: -3.000000000000039,
          y: 85,
          z: -215.5
        },
        {
          x: -3.000000000000039,
          y: 0,
          z: -209.5
        },
        {
          x: 2.999999999999961,
          y: 0,
          z: -209.5
        },
        {
          x: 2.999999999999961,
          y: 85,
          z: -209.5
        },
        {
          x: -3.000000000000039,
          y: 85,
          z: -209.5
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
        x: -3.000000000000039,
        y: 0,
        z: -215.5
      }, max: {
        x: 2.999999999999961,
        y: 85,
        z: -209.5
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
export default albuquerqueisotopesObstructions;
