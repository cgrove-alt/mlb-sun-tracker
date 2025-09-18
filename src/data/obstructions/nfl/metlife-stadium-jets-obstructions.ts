// MetLife Stadium - 3D Obstruction Models
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

export const metlifestadiumjetsObstructions: Obstruction3D[] = [
  {
    id: 'upper_deck_east',
    name: 'Upper Deck - East Side',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: 100,
          y: 100,
          z: -100
        },
        {
          x: 180,
          y: 100,
          z: -100
        },
        {
          x: 180,
          y: 160,
          z: -100
        },
        {
          x: 100,
          y: 160,
          z: -100
        },
        {
          x: 100,
          y: 100,
          z: 300
        },
        {
          x: 180,
          y: 100,
          z: 300
        },
        {
          x: 180,
          y: 160,
          z: 300
        },
        {
          x: 100,
          y: 160,
          z: 300
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
        x: 100,
        y: 100,
        z: -100
      }, max: {
        x: 180,
        y: 160,
        z: 300
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'upper_deck_west',
    name: 'Upper Deck - West Side',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: -180,
          y: 100,
          z: -100
        },
        {
          x: -100,
          y: 100,
          z: -100
        },
        {
          x: -100,
          y: 160,
          z: -100
        },
        {
          x: -180,
          y: 160,
          z: -100
        },
        {
          x: -180,
          y: 100,
          z: 300
        },
        {
          x: -100,
          y: 100,
          z: 300
        },
        {
          x: -100,
          y: 160,
          z: 300
        },
        {
          x: -180,
          y: 160,
          z: 300
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
        x: -180,
        y: 100,
        z: -100
      }, max: {
        x: -100,
        y: 160,
        z: 300
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'video_board_north',
    name: 'North Video Board',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -60,
          y: 50,
          z: 320
        },
        {
          x: 60,
          y: 50,
          z: 320
        },
        {
          x: 60,
          y: 130,
          z: 320
        },
        {
          x: -60,
          y: 130,
          z: 320
        },
        {
          x: -60,
          y: 50,
          z: 330
        },
        {
          x: 60,
          y: 50,
          z: 330
        },
        {
          x: 60,
          y: 130,
          z: 330
        },
        {
          x: -60,
          y: 130,
          z: 330
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
        x: -60,
        y: 50,
        z: 320
      }, max: {
        x: 60,
        y: 130,
        z: 330
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'video_board_south',
    name: 'South Video Board',
    type: 'structure',
    'geometry': {
      'vertices': [
        {
          x: -60,
          y: 50,
          z: -130
        },
        {
          x: 60,
          y: 50,
          z: -130
        },
        {
          x: 60,
          y: 130,
          z: -130
        },
        {
          x: -60,
          y: 130,
          z: -130
        },
        {
          x: -60,
          y: 50,
          z: -120
        },
        {
          x: 60,
          y: 50,
          z: -120
        },
        {
          x: 60,
          y: 130,
          z: -120
        },
        {
          x: -60,
          y: 130,
          z: -120
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
        x: -60,
        y: 50,
        z: -130
      }, max: {
        x: 60,
        y: 130,
        z: -120
      } },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,
  },
  {
    id: 'club_level',
    name: 'Club Level Overhang',
    type: 'overhang',
    'geometry': {
      'vertices': [
        {
          x: -150,
          y: 70,
          z: -80
        },
        {
          x: 150,
          y: 70,
          z: -80
        },
        {
          x: 150,
          y: 100,
          z: -80
        },
        {
          x: -150,
          y: 100,
          z: -80
        },
        {
          x: -150,
          y: 70,
          z: 280
        },
        {
          x: 150,
          y: 70,
          z: 280
        },
        {
          x: 150,
          y: 100,
          z: 280
        },
        {
          x: -150,
          y: 100,
          z: 280
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
        y: 70,
        z: -80
      }, max: {
        x: 150,
        y: 100,
        z: 280
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
export default metlifestadiumjetsObstructions;
