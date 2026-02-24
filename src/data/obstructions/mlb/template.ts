/**
 * MLB Stadium Obstruction Template
 *
 * This template provides a starting point for creating 3D obstruction models
 * for MLB stadiums. Obstructions cast shadows on seating sections and are
 * critical for accurate sun exposure calculations.
 *
 * USAGE:
 * 1. Copy this file and rename it to match your stadium (e.g., yankee-stadium-obstructions.ts)
 * 2. Update the stadium name and coordinate system
 * 3. Model major obstructions (upper decks, roof, scoreboards, etc.)
 * 4. Run validation: npm run validate-stadium-data
 *
 * COORDINATE SYSTEM:
 * - Origin (0, 0, 0): Home plate at field level
 * - X-axis: First base line (positive = right field)
 * - Y-axis: Third base line (positive = left field)
 * - Z-axis: Vertical (positive = up)
 * - Units: Feet
 *
 * COMMON OBSTRUCTION TYPES:
 * - 'upper_deck': Upper deck overhang casting shadow on lower sections
 * - 'roof': Full or partial roof structure
 * - 'overhang': Any overhead structure (suite level, press box, etc.)
 * - 'scoreboard': Large scoreboard or video board
 * - 'structure': Light towers, facades, architectural elements
 *
 * MODELING BEST PRACTICES:
 * 1. Start with the largest obstructions (upper deck, roof)
 * 2. Use simplified geometry - accuracy over detail
 * 3. Ensure bounding box encompasses all vertices
 * 4. Set opacity based on material (1.0 = opaque, 0.0 = transparent)
 * 5. Only set castsShadow=true for objects that block sunlight
 *
 * DATA SOURCES:
 * - Official stadium seating charts (team websites)
 * - Architectural drawings (public records)
 * - High-resolution photos (photogrammetry)
 * - Google Earth 3D models
 * - On-site measurements (if possible)
 */

import { Obstruction3D, Vector3D, Mesh3D } from '../../../types/stadium-complete';

/**
 * Helper function to create a simple box mesh
 *
 * @param min - Minimum corner (x, y, z)
 * @param max - Maximum corner (x, y, z)
 * @returns Mesh3D object with 8 vertices and 6 faces
 */
function createBoxMesh(min: Vector3D, max: Vector3D): Mesh3D {
  const vertices: Vector3D[] = [
    // Bottom face (z = min.z)
    { x: min.x, y: min.y, z: min.z }, // 0
    { x: max.x, y: min.y, z: min.z }, // 1
    { x: max.x, y: max.y, z: min.z }, // 2
    { x: min.x, y: max.y, z: min.z }, // 3
    // Top face (z = max.z)
    { x: min.x, y: min.y, z: max.z }, // 4
    { x: max.x, y: min.y, z: max.z }, // 5
    { x: max.x, y: max.y, z: max.z }, // 6
    { x: min.x, y: max.y, z: max.z }  // 7
  ];

  const faces = [
    [0, 1, 2, 3], // Bottom face
    [4, 7, 6, 5], // Top face
    [0, 4, 5, 1], // Front face
    [2, 6, 7, 3], // Back face
    [0, 3, 7, 4], // Left face
    [1, 5, 6, 2]  // Right face
  ];

  return { vertices, faces };
}

/**
 * Helper function to create a wedge mesh (for angled overhangs)
 *
 * @param base - Base rectangle corners [bottomLeft, bottomRight, topRight, topLeft]
 * @param height - Height of the wedge
 * @param angle - Angle in degrees (0 = flat, positive = slopes down toward field)
 * @returns Mesh3D object
 */
function createWedgeMesh(
  base: { min: Vector3D; max: Vector3D },
  height: number,
  angle: number = 0
): Mesh3D {
  const angleRad = (angle * Math.PI) / 180;
  const offset = height * Math.tan(angleRad);

  const vertices: Vector3D[] = [
    // Bottom face
    { x: base.min.x, y: base.min.y, z: base.min.z },
    { x: base.max.x, y: base.min.y, z: base.min.z },
    { x: base.max.x, y: base.max.y, z: base.min.z },
    { x: base.min.x, y: base.max.y, z: base.min.z },
    // Top face (angled)
    { x: base.min.x - offset, y: base.min.y, z: base.min.z + height },
    { x: base.max.x - offset, y: base.min.y, z: base.min.z + height },
    { x: base.max.x - offset, y: base.max.y, z: base.min.z + height },
    { x: base.min.x - offset, y: base.max.y, z: base.min.z + height }
  ];

  const faces = [
    [0, 1, 2, 3],
    [4, 7, 6, 5],
    [0, 4, 5, 1],
    [2, 6, 7, 3],
    [0, 3, 7, 4],
    [1, 5, 6, 2]
  ];

  return { vertices, faces };
}

/**
 * Helper function to create a curved section (for curved roofs/overhangs)
 *
 * @param center - Center point of the arc
 * @param radius - Radius of the curve
 * @param startAngle - Starting angle in degrees (0 = positive X-axis)
 * @param endAngle - Ending angle in degrees
 * @param depth - Depth (thickness) of the curved section
 * @param height - Height of the structure
 * @param segments - Number of segments to approximate the curve
 * @returns Mesh3D object
 */
function createCurvedMesh(
  center: Vector3D,
  radius: number,
  startAngle: number,
  endAngle: number,
  depth: number,
  height: number,
  segments: number = 8
): Mesh3D {
  const vertices: Vector3D[] = [];
  const faces: number[][] = [];

  const angleStep = (endAngle - startAngle) / segments;

  // Generate vertices for outer arc (bottom and top)
  for (let i = 0; i <= segments; i++) {
    const angle = (startAngle + i * angleStep) * (Math.PI / 180);
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);

    vertices.push({ x, y, z: center.z }); // Bottom
    vertices.push({ x, y, z: center.z + height }); // Top
  }

  // Generate vertices for inner arc
  for (let i = 0; i <= segments; i++) {
    const angle = (startAngle + i * angleStep) * (Math.PI / 180);
    const x = center.x + (radius - depth) * Math.cos(angle);
    const y = center.y + (radius - depth) * Math.sin(angle);

    vertices.push({ x, y, z: center.z }); // Bottom
    vertices.push({ x, y, z: center.z + height }); // Top
  }

  // Generate faces (simplified)
  for (let i = 0; i < segments; i++) {
    const idx = i * 2;
    // Outer surface
    faces.push([idx, idx + 2, idx + 3, idx + 1]);
  }

  return { vertices, faces };
}

// ============================================================================
// TEMPLATE OBSTRUCTIONS
// Replace these with actual stadium-specific obstructions
// ============================================================================

export const TEMPLATE_stadiumObstructions: Obstruction3D[] = [
  // Example 1: Upper Deck Overhang (Most Common)
  {
    id: 'upper_deck_first_base',
    name: 'Upper Deck - First Base Side',
    type: 'upper_deck',
    geometry: createBoxMesh(
      { x: 200, y: -100, z: 40 },  // Min corner (behind lower deck)
      { x: 350, y: 100, z: 120 }   // Max corner (extends over lower sections)
    ),
    boundingBox: {
      min: { x: 200, y: -100, z: 40 },
      max: { x: 350, y: 100, z: 120 }
    },
    material: {
      opacity: 1.0,      // Fully opaque (concrete structure)
      reflectivity: 0.1  // Minimal reflection
    },
    castsShadow: true
  },

  // Example 2: Upper Deck Overhang (Third Base Side)
  {
    id: 'upper_deck_third_base',
    name: 'Upper Deck - Third Base Side',
    type: 'upper_deck',
    geometry: createBoxMesh(
      { x: -100, y: 200, z: 40 },
      { x: 100, y: 350, z: 120 }
    ),
    boundingBox: {
      min: { x: -100, y: 200, z: 40 },
      max: { x: 100, y: 350, z: 120 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.1
    },
    castsShadow: true
  },

  // Example 3: Partial Roof or Canopy
  {
    id: 'canopy_outfield',
    name: 'Outfield Canopy',
    type: 'canopy',
    geometry: createBoxMesh(
      { x: -150, y: -250, z: 60 },  // Covers outfield seats
      { x: 150, y: -350, z: 80 }
    ),
    boundingBox: {
      min: { x: -150, y: -250, z: 60 },
      max: { x: 150, y: -350, z: 80 }
    },
    material: {
      opacity: 0.9,      // Slightly transparent (fabric or mesh)
      reflectivity: 0.2
    },
    castsShadow: true
  },

  // Example 4: Scoreboard
  {
    id: 'scoreboard_center',
    name: 'Center Field Scoreboard',
    type: 'scoreboard',
    geometry: createBoxMesh(
      { x: -40, y: -400, z: 30 },  // Behind center field
      { x: 40, y: -390, z: 90 }    // 80' wide, 60' tall
    ),
    boundingBox: {
      min: { x: -40, y: -400, z: 30 },
      max: { x: 40, y: -390, z: 90 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.3  // LED screen reflects some light
    },
    castsShadow: true
  },

  // Example 5: Press Box / Luxury Suites Overhang
  {
    id: 'press_box',
    name: 'Press Box / Luxury Suites',
    type: 'overhang',
    geometry: createBoxMesh(
      { x: -80, y: 150, z: 50 },   // Behind home plate, upper level
      { x: 80, y: 200, z: 70 }
    ),
    boundingBox: {
      min: { x: -80, y: 150, z: 50 },
      max: { x: 80, y: 200, z: 70 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.2
    },
    castsShadow: true
  },

  // Example 6: Facade or Decorative Structure
  {
    id: 'facade_entrance',
    name: 'Main Entrance Facade',
    type: 'structure',
    geometry: createBoxMesh(
      { x: -50, y: 250, z: 0 },
      { x: 50, y: 260, z: 40 }
    ),
    boundingBox: {
      min: { x: -50, y: 250, z: 0 },
      max: { x: 50, y: 260, z: 40 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.15
    },
    castsShadow: true
  }
];

// ============================================================================
// INSTRUCTIONS FOR STADIUM-SPECIFIC MODELING
// ============================================================================

/**
 * STEP 1: Gather Reference Materials
 * ----------------------------------
 * - Seating charts from team website
 * - Architectural drawings (if available)
 * - High-resolution photos from multiple angles
 * - Google Earth 3D view
 * - Virtual stadium tours
 *
 * STEP 2: Establish Coordinate System
 * ------------------------------------
 * - Set home plate as origin (0, 0, 0)
 * - Align X-axis with first base line
 * - Align Y-axis with third base line
 * - Measure key distances (e.g., distance to outfield wall: ~400 ft)
 *
 * STEP 3: Identify Major Obstructions
 * ------------------------------------
 * Priority order:
 * 1. Upper deck overhangs (most common shadow source)
 * 2. Roof structures (if present)
 * 3. Large scoreboards
 * 4. Suite/club level overhangs
 * 5. Architectural features (facades, light towers)
 *
 * STEP 4: Model Each Obstruction
 * -------------------------------
 * For each obstruction:
 * a) Determine approximate dimensions (length, width, height)
 * b) Identify corner coordinates using reference materials
 * c) Choose appropriate geometry (box, wedge, or curved)
 * d) Set material properties:
 *    - opacity: 1.0 for solid concrete/metal, 0.5-0.9 for mesh/fabric
 *    - reflectivity: 0.1 for matte, 0.3 for glass, 0.5 for polished metal
 * e) Set castsShadow: true for all sun-blocking structures
 *
 * STEP 5: Validate
 * ----------------
 * 1. Run: npm run validate-stadium-data
 * 2. Check for errors (invalid coordinates, missing fields, etc.)
 * 3. Visually verify using 3D visualization tool (if available)
 * 4. Test sun calculations for a known sunny day
 * 5. Compare results with real-world observations or photos
 *
 * STEP 6: Refine
 * --------------
 * - Adjust coordinates based on validation results
 * - Add missing obstructions
 * - Simplify complex geometry for performance
 * - Document any assumptions or approximations
 *
 * COMMON MEASUREMENTS:
 * -------------------
 * - Field level: z = 0
 * - Lower deck: z = 5-15 ft
 * - Club level: z = 30-50 ft
 * - Upper deck: z = 50-100 ft
 * - Roof height: z = 100-200 ft
 * - Typical upper deck overhang: 20-40 ft depth
 * - Scoreboard height: 40-80 ft
 * - Distance to outfield wall: 330-420 ft
 * - Foul pole distance: 310-350 ft
 */

/**
 * EXAMPLE: Measuring Upper Deck Overhang
 * --------------------------------------
 *
 * Given:
 * - Stadium has an upper deck that extends over the lower seating
 * - Lower deck ends at approximately 250 ft from home plate
 * - Upper deck begins at 240 ft (10 ft overlap/overhang)
 * - Upper deck base is at 50 ft elevation
 * - Upper deck is 30 ft thick (50 ft to 80 ft elevation)
 * - Section spans from 45° to 135° (first base side, 90° arc)
 *
 * Coordinates (simplified to box approximation):
 * - Convert angles to X/Y coordinates using trigonometry
 * - 45° at 240 ft: x = 240 * cos(45°) ≈ 170, y = 240 * sin(45°) ≈ 170
 * - 135° at 240 ft: x = 240 * cos(135°) ≈ -170, y = 240 * sin(135°) ≈ 170
 * - Depth: 30-40 ft from edge
 *
 * Result:
 * min: { x: -170, y: 170, z: 50 }
 * max: { x: 170, y: 210, z: 80 }
 */

/**
 * TROUBLESHOOTING:
 * ---------------
 * Q: Shadows don't match real observations
 * A: Check sun azimuth calculation, verify stadium orientation angle
 *
 * Q: Validation fails with "coordinate out of bounds"
 * A: Verify measurements, ensure coordinates are in feet not meters
 *
 * Q: Too many obstructions slowing down calculations
 * A: Combine nearby small obstructions into larger simplified boxes
 *
 * Q: Curved roof not rendering correctly
 * A: Increase segments parameter or use multiple box approximations
 */
