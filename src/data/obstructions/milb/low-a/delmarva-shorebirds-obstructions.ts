// Arthur W. Perdue Stadium - 3D Obstruction Models
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

export const delmarvashorebirdsObstructions: Obstruction3D[] = [
  {
    id: 'scoreboard',
    name: 'Scoreboard',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -13.750000000000002,
          y: 13.750000000000002,
          z: 176
        },
        {
          x: 13.750000000000002,
          y: 13.750000000000002,
          z: 176
        },
        {
          x: 13.750000000000002,
          y: 41.25,
          z: 176
        },
        {
          x: -13.750000000000002,
          y: 41.25,
          z: 176
        },
        {
          x: -13.750000000000002,
          y: 13.750000000000002,
          z: 178.75000000000003
        },
        {
          x: 13.750000000000002,
          y: 13.750000000000002,
          z: 178.75000000000003
        },
        {
          x: 13.750000000000002,
          y: 41.25,
          z: 178.75000000000003
        },
        {
          x: -13.750000000000002,
          y: 41.25,
          z: 178.75000000000003
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
        x: -13.750000000000002,
        y: 13.750000000000002,
        z: 176
      }, max: {
        x: 13.750000000000002,
        y: 41.25,
        z: 178.75000000000003
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
          x: 134.5,
          y: 0,
          z: -3
        },
        {
          x: 140.5,
          y: 0,
          z: -3
        },
        {
          x: 140.5,
          y: 55.00000000000001,
          z: -3
        },
        {
          x: 134.5,
          y: 55.00000000000001,
          z: -3
        },
        {
          x: 134.5,
          y: 0,
          z: 3
        },
        {
          x: 140.5,
          y: 0,
          z: 3
        },
        {
          x: 140.5,
          y: 55.00000000000001,
          z: 3
        },
        {
          x: 134.5,
          y: 55.00000000000001,
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
        x: 134.5,
        y: 0,
        z: -3
      }, max: {
        x: 140.5,
        y: 55.00000000000001,
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
          x: -140.5,
          y: 0,
          z: -2.999999999999983
        },
        {
          x: -134.5,
          y: 0,
          z: -2.999999999999983
        },
        {
          x: -134.5,
          y: 55.00000000000001,
          z: -2.999999999999983
        },
        {
          x: -140.5,
          y: 55.00000000000001,
          z: -2.999999999999983
        },
        {
          x: -140.5,
          y: 0,
          z: 3.000000000000017
        },
        {
          x: -134.5,
          y: 0,
          z: 3.000000000000017
        },
        {
          x: -134.5,
          y: 55.00000000000001,
          z: 3.000000000000017
        },
        {
          x: -140.5,
          y: 55.00000000000001,
          z: 3.000000000000017
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
        x: -140.5,
        y: 0,
        z: -2.999999999999983
      }, max: {
        x: -134.5,
        y: 55.00000000000001,
        z: 3.000000000000017
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
export default delmarvashorebirdsObstructions;
