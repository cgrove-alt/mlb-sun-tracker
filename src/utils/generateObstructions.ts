// Stadium Obstruction Generator
// Creates 3D obstruction models for accurate shadow calculations

import { Obstruction3D, Vector3D, Mesh3D } from '../types/stadium-complete';

// Helper to create box mesh
export function createBoxMesh(min: Vector3D, max: Vector3D): Mesh3D {
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

// Generate MLB obstructions
export function generateMLBObstructions(
  stadiumId: string,
  orientation: number,
  hasRoof: boolean,
  roofType?: 'fixed' | 'retractable'
): Obstruction3D[] {
  const obstructions: Obstruction3D[] = [];
  
  // Upper deck overhang - standard for most MLB stadiums
  obstructions.push({
    id: 'upper_deck_home',
    name: 'Upper Deck Overhang - Home Plate',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -65, y: 95, z: 55 },
      { x: 65, y: 135, z: 60 }
    ),
    boundingBox: {
      min: { x: -65, y: 95, z: 55 },
      max: { x: 65, y: 135, z: 60 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  // First base side overhang
  obstructions.push({
    id: 'upper_deck_1b',
    name: 'Upper Deck Overhang - First Base',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: 60, y: 90, z: 50 },
      { x: 150, y: 130, z: 180 }
    ),
    boundingBox: {
      min: { x: 60, y: 90, z: 50 },
      max: { x: 150, y: 130, z: 180 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  // Third base side overhang
  obstructions.push({
    id: 'upper_deck_3b',
    name: 'Upper Deck Overhang - Third Base',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -150, y: 90, z: 50 },
      { x: -60, y: 130, z: 180 }
    ),
    boundingBox: {
      min: { x: -150, y: 90, z: 50 },
      max: { x: -60, y: 130, z: 180 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  // Main scoreboard (center field)
  obstructions.push({
    id: 'main_scoreboard',
    name: 'Main Scoreboard',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -40, y: 40, z: 400 },
      { x: 40, y: 120, z: 410 }
    ),
    boundingBox: {
      min: { x: -40, y: 40, z: 400 },
      max: { x: 40, y: 120, z: 410 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  // Light towers (4 standard positions)
  const lightTowerPositions = [
    { x: 120, z: 120 },  // Right field
    { x: -120, z: 120 }, // Left field
    { x: 100, z: 350 },  // Right center
    { x: -100, z: 350 }  // Left center
  ];
  
  lightTowerPositions.forEach((pos, index) => {
    obstructions.push({
      id: `light_tower_${index + 1}`,
      name: `Light Tower ${index + 1}`,
      type: 'structure',
      geometry: createBoxMesh(
        { x: pos.x - 5, y: 0, z: pos.z - 5 },
        { x: pos.x + 5, y: 150, z: pos.z + 5 }
      ),
      boundingBox: {
        min: { x: pos.x - 5, y: 0, z: pos.z - 5 },
        max: { x: pos.x + 5, y: 150, z: pos.z + 5 }
      },
      material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
      castsShadow: true
    });
  });
  
  // Roof structure if applicable
  if (hasRoof) {
    obstructions.push({
      id: 'roof_structure',
      name: roofType === 'retractable' ? 'Retractable Roof' : 'Fixed Roof',
      type: 'roof',
      geometry: createBoxMesh(
        { x: -200, y: 140, z: -50 },
        { x: 200, y: 180, z: 450 }
      ),
      boundingBox: {
        min: { x: -200, y: 140, z: -50 },
        max: { x: 200, y: 180, z: 450 }
      },
      material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
      castsShadow: true
    });
  }
  
  // Facade/Press box
  obstructions.push({
    id: 'press_box',
    name: 'Press Box / Luxury Suites',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -50, y: 80, z: 30 },
      { x: 50, y: 110, z: 40 }
    ),
    boundingBox: {
      min: { x: -50, y: 80, z: 30 },
      max: { x: 50, y: 110, z: 40 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  return obstructions;
}

// Generate MiLB obstructions
export function generateMiLBObstructions(
  stadiumId: string,
  orientation: number,
  capacity: number,
  level: 'AAA' | 'AA' | 'High-A' | 'Low-A'
): Obstruction3D[] {
  const obstructions: Obstruction3D[] = [];
  
  // Scale factors based on level
  const scale = {
    'AAA': 0.85,
    'AA': 0.75,
    'High-A': 0.65,
    'Low-A': 0.55
  }[level];
  
  // Smaller upper deck overhang
  if (level === 'AAA' || level === 'AA') {
    obstructions.push({
      id: 'upper_deck_home',
      name: 'Upper Deck - Home Plate',
      type: 'overhang',
      geometry: createBoxMesh(
        { x: -45 * scale, y: 60 * scale, z: 40 * scale },
        { x: 45 * scale, y: 90 * scale, z: 45 * scale }
      ),
      boundingBox: {
        min: { x: -45 * scale, y: 60 * scale, z: 40 * scale },
        max: { x: 45 * scale, y: 90 * scale, z: 45 * scale }
      },
      material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
      castsShadow: true
    });
  }
  
  // Smaller scoreboard
  obstructions.push({
    id: 'scoreboard',
    name: 'Scoreboard',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -25 * scale, y: 25 * scale, z: 320 * scale },
      { x: 25 * scale, y: 75 * scale, z: 325 * scale }
    ),
    boundingBox: {
      min: { x: -25 * scale, y: 25 * scale, z: 320 * scale },
      max: { x: 25 * scale, y: 75 * scale, z: 325 * scale }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  // Light standards (fewer for lower levels)
  const numLights = level === 'AAA' ? 4 : level === 'AA' ? 4 : 2;
  for (let i = 0; i < numLights; i++) {
    const angle = (i * 360 / numLights) * Math.PI / 180;
    const radius = 250 * scale;
    obstructions.push({
      id: `light_${i + 1}`,
      name: `Light Standard ${i + 1}`,
      type: 'structure',
      geometry: createBoxMesh(
        { x: Math.cos(angle) * radius - 3, y: 0, z: Math.sin(angle) * radius - 3 },
        { x: Math.cos(angle) * radius + 3, y: 100 * scale, z: Math.sin(angle) * radius + 3 }
      ),
      boundingBox: {
        min: { x: Math.cos(angle) * radius - 3, y: 0, z: Math.sin(angle) * radius - 3 },
        max: { x: Math.cos(angle) * radius + 3, y: 100 * scale, z: Math.sin(angle) * radius + 3 }
      },
      material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
      castsShadow: true
    });
  }
  
  return obstructions;
}

// Generate NFL obstructions
export function generateNFLObstructions(
  stadiumId: string,
  orientation: number,
  hasRoof: boolean,
  isOpenAir: boolean
): Obstruction3D[] {
  const obstructions: Obstruction3D[] = [];
  
  // Larger upper deck structures
  obstructions.push({
    id: 'upper_deck_east',
    name: 'Upper Deck - East Side',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: 100, y: 100, z: -100 },
      { x: 180, y: 160, z: 300 }
    ),
    boundingBox: {
      min: { x: 100, y: 100, z: -100 },
      max: { x: 180, y: 160, z: 300 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  obstructions.push({
    id: 'upper_deck_west',
    name: 'Upper Deck - West Side',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -180, y: 100, z: -100 },
      { x: -100, y: 160, z: 300 }
    ),
    boundingBox: {
      min: { x: -180, y: 100, z: -100 },
      max: { x: -100, y: 160, z: 300 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  // Massive video boards (NFL style)
  obstructions.push({
    id: 'video_board_north',
    name: 'North Video Board',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -60, y: 50, z: 320 },
      { x: 60, y: 130, z: 330 }
    ),
    boundingBox: {
      min: { x: -60, y: 50, z: 320 },
      max: { x: 60, y: 130, z: 330 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  obstructions.push({
    id: 'video_board_south',
    name: 'South Video Board',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -60, y: 50, z: -130 },
      { x: 60, y: 130, z: -120 }
    ),
    boundingBox: {
      min: { x: -60, y: 50, z: -130 },
      max: { x: 60, y: 130, z: -120 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  // Roof structure for domed/retractable stadiums
  if (hasRoof) {
    obstructions.push({
      id: 'roof_structure',
      name: isOpenAir ? 'Partial Roof' : 'Dome Roof',
      type: 'roof',
      geometry: createBoxMesh(
        { x: -250, y: 180, z: -150 },
        { x: 250, y: 220, z: 350 }
      ),
      boundingBox: {
        min: { x: -250, y: 180, z: -150 },
        max: { x: 250, y: 220, z: 350 }
      },
      material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
      castsShadow: true
    });
  }
  
  // Club level overhang
  obstructions.push({
    id: 'club_level',
    name: 'Club Level Overhang',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -150, y: 70, z: -80 },
      { x: 150, y: 100, z: 280 }
    ),
    boundingBox: {
      min: { x: -150, y: 70, z: -80 },
      max: { x: 150, y: 100, z: 280 }
    },
    material: { opacity: 1.0, reflectivity: 0.3, color: "#808080" },
    castsShadow: true,
  });
  
  return obstructions;
}