// Truist Stadium - 3D Obstruction Models
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

export const winstonsalemdashObstructions: Obstruction3D[] = [
  {
    id: 'scoreboard',
    name: 'Scoreboard',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -16.25,
          y: 16.25,
          z: 208
        },
        {
          x: 16.25,
          y: 16.25,
          z: 208
        },
        {
          x: 16.25,
          y: 48.75,
          z: 208
        },
        {
          x: -16.25,
          y: 48.75,
          z: 208
        },
        {
          x: -16.25,
          y: 16.25,
          z: 211.25
        },
        {
          x: 16.25,
          y: 16.25,
          z: 211.25
        },
        {
          x: 16.25,
          y: 48.75,
          z: 211.25
        },
        {
          x: -16.25,
          y: 48.75,
          z: 211.25
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
        x: -16.25,
        y: 16.25,
        z: 208
      }, max: {
        x: 16.25,
        y: 48.75,
        z: 211.25
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
          x: 159.5,
          y: 0,
          z: -3
        },
        {
          x: 165.5,
          y: 0,
          z: -3
        },
        {
          x: 165.5,
          y: 65,
          z: -3
        },
        {
          x: 159.5,
          y: 65,
          z: -3
        },
        {
          x: 159.5,
          y: 0,
          z: 3
        },
        {
          x: 165.5,
          y: 0,
          z: 3
        },
        {
          x: 165.5,
          y: 65,
          z: 3
        },
        {
          x: 159.5,
          y: 65,
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
        x: 159.5,
        y: 0,
        z: -3
      }, max: {
        x: 165.5,
        y: 65,
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
          x: -165.5,
          y: 0,
          z: -2.99999999999998
        },
        {
          x: -159.5,
          y: 0,
          z: -2.99999999999998
        },
        {
          x: -159.5,
          y: 65,
          z: -2.99999999999998
        },
        {
          x: -165.5,
          y: 65,
          z: -2.99999999999998
        },
        {
          x: -165.5,
          y: 0,
          z: 3.00000000000002
        },
        {
          x: -159.5,
          y: 0,
          z: 3.00000000000002
        },
        {
          x: -159.5,
          y: 65,
          z: 3.00000000000002
        },
        {
          x: -165.5,
          y: 65,
          z: 3.00000000000002
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
        x: -165.5,
        y: 0,
        z: -2.99999999999998
      }, max: {
        x: -159.5,
        y: 65,
        z: 3.00000000000002
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
export default winstonsalemdashObstructions;
