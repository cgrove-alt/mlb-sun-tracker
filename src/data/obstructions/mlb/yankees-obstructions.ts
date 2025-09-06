// Yankee Stadium - 3D Obstruction Models
// Comprehensive obstruction data for accurate shadow calculations

import { Obstruction3D, Vector3D, Mesh3D } from '../../../types/stadium-complete';

// Helper to create box mesh
function createBoxMesh(
  min: Vector3D,
  max: Vector3D
): Mesh3D {
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

// Yankee Stadium Obstructions
export const yankeeStadiumObstructions: Obstruction3D[] = [
  // ========== UPPER DECK OVERHANG ==========
  {
    id: 'upper_deck_overhang_home',
    name: 'Upper Deck Overhang - Home Plate',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -60, y: 100, z: 60 },
      { x: 60, y: 140, z: 65 }
    ),
    boundingBox: {
      min: { x: -60, y: 100, z: 60 },
      max: { x: 60, y: 140, z: 65 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.2,
      color: '#003087' // Yankee blue
    },
    castsShadow: true
  },

  {
    id: 'upper_deck_overhang_first',
    name: 'Upper Deck Overhang - First Base',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: 60, y: 60, z: 60 },
      { x: 140, y: 100, z: 65 }
    ),
    boundingBox: {
      min: { x: 60, y: 60, z: 60 },
      max: { x: 140, y: 100, z: 65 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.2,
      color: '#003087'
    },
    castsShadow: true
  },

  {
    id: 'upper_deck_overhang_third',
    name: 'Upper Deck Overhang - Third Base',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -140, y: 60, z: 60 },
      { x: -60, y: 100, z: 65 }
    ),
    boundingBox: {
      min: { x: -140, y: 60, z: 60 },
      max: { x: -60, y: 100, z: 65 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.2,
      color: '#003087'
    },
    castsShadow: true
  },

  // ========== FRIEZE FACADE ==========
  {
    id: 'frieze_facade',
    name: 'Frieze Facade',
    type: 'facade',
    geometry: {
      vertices: [
        // Complex decorative frieze shape
        { x: -200, y: 100, z: 90 },
        { x: 200, y: 100, z: 90 },
        { x: 200, y: 120, z: 90 },
        { x: -200, y: 120, z: 90 },
        { x: -200, y: 100, z: 110 },
        { x: 200, y: 100, z: 110 },
        { x: 200, y: 120, z: 110 },
        { x: -200, y: 120, z: 110 },
        // Decorative cutouts
        { x: -180, y: 100, z: 95 },
        { x: -160, y: 100, z: 105 },
        { x: -140, y: 100, z: 95 },
        { x: -120, y: 100, z: 105 }
      ],
      faces: [
        [0, 1, 2, 3],
        [4, 7, 6, 5],
        [0, 4, 5, 1],
        [2, 6, 7, 3],
        [8, 9, 10, 11]
      ]
    },
    boundingBox: {
      min: { x: -200, y: 100, z: 90 },
      max: { x: 200, y: 120, z: 110 }
    },
    material: {
      opacity: 0.7,
      reflectivity: 0.3,
      color: '#FFFFFF'
    },
    castsShadow: true
  },

  // ========== GRANDSTAND ROOF ==========
  {
    id: 'grandstand_roof',
    name: 'Grandstand Roof',
    type: 'roof',
    geometry: createBoxMesh(
      { x: -80, y: 180, z: 155 },
      { x: 80, y: 230, z: 160 }
    ),
    boundingBox: {
      min: { x: -80, y: 180, z: 155 },
      max: { x: 80, y: 230, z: 160 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.4,
      color: '#C0C0C0'
    },
    castsShadow: true
  },

  // ========== MONUMENT PARK OVERHANG ==========
  {
    id: 'monument_park_overhang',
    name: 'Monument Park Overhang',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -50, y: 380, z: 15 },
      { x: 50, y: 410, z: 35 }
    ),
    boundingBox: {
      min: { x: -50, y: 380, z: 15 },
      max: { x: 50, y: 410, z: 35 }
    },
    material: {
      opacity: 0.9,
      reflectivity: 0.2,
      color: '#003087'
    },
    castsShadow: true
  },

  // ========== VIDEO BOARD (Center Field) ==========
  {
    id: 'center_field_video_board',
    name: 'Center Field Video Board',
    type: 'scoreboard',
    geometry: createBoxMesh(
      { x: -30, y: 408, z: 20 },
      { x: 30, y: 410, z: 60 }
    ),
    boundingBox: {
      min: { x: -30, y: 408, z: 20 },
      max: { x: 30, y: 410, z: 60 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.6,
      color: '#000000'
    },
    castsShadow: true
  },

  // ========== MOHEGAN SUN SPORTS BAR (Right Field) ==========
  {
    id: 'mohegan_sun_bar',
    name: 'Mohegan Sun Sports Bar',
    type: 'structure',
    geometry: {
      vertices: [
        { x: 100, y: 280, z: 25 },
        { x: 150, y: 260, z: 25 },
        { x: 150, y: 300, z: 25 },
        { x: 100, y: 320, z: 25 },
        { x: 100, y: 280, z: 45 },
        { x: 150, y: 260, z: 45 },
        { x: 150, y: 300, z: 45 },
        { x: 100, y: 320, z: 45 }
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
      min: { x: 100, y: 260, z: 25 },
      max: { x: 150, y: 320, z: 45 }
    },
    material: {
      opacity: 0.8,
      reflectivity: 0.5,
      color: '#1C1C1C'
    },
    castsShadow: true
  },

  // ========== SUITE LEVEL GLASS ==========
  {
    id: 'suite_level_glass',
    name: 'Suite Level Glass Windows',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -100, y: 120, z: 65 },
      { x: 100, y: 125, z: 85 }
    ),
    boundingBox: {
      min: { x: -100, y: 120, z: 65 },
      max: { x: 100, y: 125, z: 85 }
    },
    material: {
      opacity: 0.3, // Semi-transparent glass
      reflectivity: 0.7,
      color: '#E6F3FF'
    },
    castsShadow: true
  },

  // ========== LIGHT TOWERS ==========
  {
    id: 'light_tower_rf',
    name: 'Right Field Light Tower',
    type: 'structure',
    geometry: {
      vertices: [
        // Tower base
        { x: 180, y: 320, z: 0 },
        { x: 185, y: 320, z: 0 },
        { x: 185, y: 325, z: 0 },
        { x: 180, y: 325, z: 0 },
        // Tower top
        { x: 182, y: 322, z: 120 },
        { x: 183, y: 322, z: 120 },
        { x: 183, y: 323, z: 120 },
        { x: 182, y: 323, z: 120 }
      ],
      faces: [
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [4, 5, 6, 7]
      ]
    },
    boundingBox: {
      min: { x: 180, y: 320, z: 0 },
      max: { x: 185, y: 325, z: 120 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#696969'
    },
    castsShadow: true
  },

  {
    id: 'light_tower_lf',
    name: 'Left Field Light Tower',
    type: 'structure',
    geometry: {
      vertices: [
        { x: -185, y: 320, z: 0 },
        { x: -180, y: 320, z: 0 },
        { x: -180, y: 325, z: 0 },
        { x: -185, y: 325, z: 0 },
        { x: -183, y: 322, z: 120 },
        { x: -182, y: 322, z: 120 },
        { x: -182, y: 323, z: 120 },
        { x: -183, y: 323, z: 120 }
      ],
      faces: [
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [4, 5, 6, 7]
      ]
    },
    boundingBox: {
      min: { x: -185, y: 320, z: 0 },
      max: { x: -180, y: 325, z: 120 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#696969'
    },
    castsShadow: true
  },

  // ========== PRESS BOX ==========
  {
    id: 'press_box',
    name: 'Press Box',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -40, y: 140, z: 85 },
      { x: 40, y: 160, z: 95 }
    ),
    boundingBox: {
      min: { x: -40, y: 140, z: 85 },
      max: { x: 40, y: 160, z: 95 }
    },
    material: {
      opacity: 0.9,
      reflectivity: 0.4,
      color: '#2C2C2C'
    },
    castsShadow: true
  }
];

// Export obstruction map for quick lookup
export const yankeeStadiumObstructionMap = new Map(
  yankeeStadiumObstructions.map(obs => [obs.id, obs])
);

// Calculate total shadow area
export function calculateShadowCoverage(
  obstructions: Obstruction3D[],
  sunAzimuth: number,
  sunElevation: number
): number {
  // Complex calculation would go here
  // This is a placeholder for the actual shadow calculation
  let totalShadowArea = 0;
  
  obstructions.forEach(obs => {
    if (obs.castsShadow) {
      const box = obs.boundingBox;
      const width = box.max.x - box.min.x;
      const depth = box.max.y - box.min.y;
      const height = box.max.z - box.min.z;
      
      // Simple shadow projection (would be more complex in reality)
      const shadowLength = height / Math.tan(sunElevation * Math.PI / 180);
      totalShadowArea += width * shadowLength;
    }
  });
  
  return totalShadowArea;
}