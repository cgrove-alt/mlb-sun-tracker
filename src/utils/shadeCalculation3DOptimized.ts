// Optimized 3D Shade Calculation Engine
// Performance-optimized version with spatial indexing and parallel processing

import { Vector3D } from '../types/stadium-complete';
import {
  sectionCompassAngle,
  sunIncidence,
  shadowReachFt,
  BOWL_DEFAULTS,
  structuralShadeFraction,
  type SeatingLevel,
} from './bowlGeometry';

// Core interfaces for 3D shade calculation
export interface Seat {
  id: string;
  sectionId: string;
  row: number;
  seatNumber: number;
  position: Vector3D;
}

export interface Obstruction {
  id: string;
  type: 'roof' | 'upper_deck' | 'overhang' | 'scoreboard' | 'structure';
  boundingBox: {
    min: Vector3D;
    max: Vector3D;
  };
  opacity?: number; // 0-1, where 1 is fully opaque
}

export interface SunPosition {
  azimuth: number; // Degrees from north (0-360)
  elevation: number; // Degrees above horizon (-90 to 90)
  azimuthRadians: number;
  elevationRadians: number;
  correctedElevation?: number; // Elevation with atmospheric refraction correction
}

export interface SectionGeometry {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  vertices: Vector3D[]; // Polygonal boundary of section
  seats: Seat[];
  baseAngle: number;
  angleSpan: number;
}

export interface Stadium3DModel {
  id: string;
  sections: SectionGeometry[];
  obstructions: Obstruction[];
  origin: Vector3D; // Stadium center point (typically home plate)
  orientation: number; // Degrees from north
}

export interface ShadeResult {
  seatId: string;
  inShade: boolean;
  obstructedBy?: string[]; // IDs of obstructions blocking sun
  shadeFraction: number; // 0-1, percentage of seat in shade
}

export interface SectionShadeResult {
  sectionId: string;
  percentageInShade: number;
  seatsInShade: number;
  totalSeats: number;
  seatResults: ShadeResult[];
}

interface BVHNode {
  min: Vector3D;
  max: Vector3D;
  obstructions: Obstruction[];
  left?: BVHNode;
  right?: BVHNode;
}

interface SpatialGrid {
  cellSize: number;
  grid: Map<string, Obstruction[]>;
  bounds: { min: Vector3D; max: Vector3D };
}

export class OptimizedShadeCalculator3D {
  private stadium: Stadium3DModel;
  private bvhRoot?: BVHNode;
  private spatialGrid?: SpatialGrid;
  private seatCache: Map<string, ShadeResult>;
  private sunDirectionCache: Map<string, Vector3D>;
  private useWebWorkers: boolean;
  private workerPool?: Worker[];
  
  constructor(stadium: Stadium3DModel, useWebWorkers: boolean = false) {
    // Defence in depth: obstruction bounding boxes arrive from several data
    // sources, and a box whose `min` exceeds its `max` on any axis silently
    // breaks the ray/slab test — the obstruction simply stops casting shade,
    // with no error anywhere. Normalise on the way in so a bad box can never
    // quietly cost a fan their shade again.
    this.stadium = {
      ...stadium,
      obstructions: stadium.obstructions.map(obs => ({
        ...obs,
        boundingBox: {
          min: {
            x: Math.min(obs.boundingBox.min.x, obs.boundingBox.max.x),
            y: Math.min(obs.boundingBox.min.y, obs.boundingBox.max.y),
            z: Math.min(obs.boundingBox.min.z, obs.boundingBox.max.z),
          },
          max: {
            x: Math.max(obs.boundingBox.min.x, obs.boundingBox.max.x),
            y: Math.max(obs.boundingBox.min.y, obs.boundingBox.max.y),
            z: Math.max(obs.boundingBox.min.z, obs.boundingBox.max.z),
          },
        },
      })),
    };
    this.seatCache = new Map();
    this.sunDirectionCache = new Map();
    this.useWebWorkers = useWebWorkers && typeof Worker !== 'undefined';
    
    // Build acceleration structures
    this.buildBVH();
    this.buildSpatialGrid();
    
    // Initialize worker pool if enabled
    if (this.useWebWorkers) {
      this.initializeWorkerPool();
    }
  }
  
  // Build Bounding Volume Hierarchy for obstructions
  private buildBVH(): void {
    if (this.stadium.obstructions.length === 0) return;
    
    this.bvhRoot = this.buildBVHNode(this.stadium.obstructions);
  }
  
  private buildBVHNode(obstructions: Obstruction[]): BVHNode {
    const node: BVHNode = {
      min: { x: Infinity, y: Infinity, z: Infinity },
      max: { x: -Infinity, y: -Infinity, z: -Infinity },
      obstructions: []
    };
    
    // Calculate bounds
    for (const obs of obstructions) {
      node.min.x = Math.min(node.min.x, obs.boundingBox.min.x);
      node.min.y = Math.min(node.min.y, obs.boundingBox.min.y);
      node.min.z = Math.min(node.min.z, obs.boundingBox.min.z);
      node.max.x = Math.max(node.max.x, obs.boundingBox.max.x);
      node.max.y = Math.max(node.max.y, obs.boundingBox.max.y);
      node.max.z = Math.max(node.max.z, obs.boundingBox.max.z);
    }
    
    // Leaf node if few obstructions
    if (obstructions.length <= 4) {
      node.obstructions = obstructions;
      return node;
    }
    
    // Split along longest axis
    const size = {
      x: node.max.x - node.min.x,
      y: node.max.y - node.min.y,
      z: node.max.z - node.min.z
    };
    
    let splitAxis: 'x' | 'y' | 'z' = 'x';
    if (size.y > size.x && size.y > size.z) splitAxis = 'y';
    else if (size.z > size.x) splitAxis = 'z';
    
    // Sort and split
    const sorted = [...obstructions].sort((a, b) => {
      const centerA = (a.boundingBox.min[splitAxis] + a.boundingBox.max[splitAxis]) / 2;
      const centerB = (b.boundingBox.min[splitAxis] + b.boundingBox.max[splitAxis]) / 2;
      return centerA - centerB;
    });
    
    const mid = Math.floor(sorted.length / 2);
    node.left = this.buildBVHNode(sorted.slice(0, mid));
    node.right = this.buildBVHNode(sorted.slice(mid));
    
    return node;
  }
  
  // Build spatial grid for quick lookups
  private buildSpatialGrid(): void {
    const cellSize = 50; // 50 feet cells
    const grid = new Map<string, Obstruction[]>();
    
    // Calculate bounds
    const bounds = {
      min: { x: -500, y: -500, z: 0 },
      max: { x: 500, y: 500, z: 200 }
    };
    
    // Place obstructions in grid cells
    for (const obs of this.stadium.obstructions) {
      const minCell = this.worldToGrid(obs.boundingBox.min, cellSize);
      const maxCell = this.worldToGrid(obs.boundingBox.max, cellSize);
      
      for (let x = minCell.x; x <= maxCell.x; x++) {
        for (let y = minCell.y; y <= maxCell.y; y++) {
          for (let z = minCell.z; z <= maxCell.z; z++) {
            const key = `${x},${y},${z}`;
            if (!grid.has(key)) {
              grid.set(key, []);
            }
            grid.get(key)!.push(obs);
          }
        }
      }
    }
    
    this.spatialGrid = { cellSize, grid, bounds };
  }
  
  private worldToGrid(pos: Vector3D, cellSize: number): { x: number; y: number; z: number } {
    return {
      x: Math.floor(pos.x / cellSize),
      y: Math.floor(pos.y / cellSize),
      z: Math.floor(pos.z / cellSize)
    };
  }
  
  // Initialize web worker pool for parallel processing
  private initializeWorkerPool(): void {
    const workerCount = Math.min(navigator.hardwareConcurrency || 4, 8);
    this.workerPool = [];
    
    for (let i = 0; i < workerCount; i++) {
      // Worker would be created here with shade calculation logic
      // For now, we'll use synchronous processing
    }
  }
  
  // Optimized ray-AABB intersection with early exit
  private rayIntersectsAABBOptimized(
    rayOrigin: Vector3D,
    rayDirection: Vector3D,
    boxMin: Vector3D,
    boxMax: Vector3D,
    maxDistance: number = Infinity
  ): boolean {
    const invDir = {
      x: 1 / rayDirection.x,
      y: 1 / rayDirection.y,
      z: 1 / rayDirection.z
    };
    
    const t1 = (boxMin.x - rayOrigin.x) * invDir.x;
    const t2 = (boxMax.x - rayOrigin.x) * invDir.x;
    const t3 = (boxMin.y - rayOrigin.y) * invDir.y;
    const t4 = (boxMax.y - rayOrigin.y) * invDir.y;
    const t5 = (boxMin.z - rayOrigin.z) * invDir.z;
    const t6 = (boxMax.z - rayOrigin.z) * invDir.z;
    
    const tMin = Math.max(
      Math.min(t1, t2),
      Math.min(t3, t4),
      Math.min(t5, t6)
    );
    
    const tMax = Math.min(
      Math.max(t1, t2),
      Math.max(t3, t4),
      Math.max(t5, t6),
      maxDistance
    );
    
    return tMax >= 0 && tMax >= tMin;
  }
  
  // Traverse BVH to find intersecting obstructions
  private traverseBVH(
    node: BVHNode | undefined,
    rayOrigin: Vector3D,
    rayDirection: Vector3D
  ): Obstruction[] {
    if (!node) return [];
    
    // Check if ray intersects node bounds
    if (!this.rayIntersectsAABBOptimized(rayOrigin, rayDirection, node.min, node.max)) {
      return [];
    }
    
    // Leaf node - test obstructions
    if (node.obstructions.length > 0) {
      return node.obstructions.filter(obs =>
        this.rayIntersectsAABBOptimized(
          rayOrigin,
          rayDirection,
          obs.boundingBox.min,
          obs.boundingBox.max
        )
      );
    }
    
    // Internal node - traverse children
    const results: Obstruction[] = [];
    if (node.left) {
      results.push(...this.traverseBVH(node.left, rayOrigin, rayDirection));
    }
    if (node.right) {
      results.push(...this.traverseBVH(node.right, rayOrigin, rayDirection));
    }
    
    return results;
  }
  
  // Optimized seat shade calculation using acceleration structures
  private isSeatInShadeOptimized(seat: Seat, sunRayDirection: Vector3D): ShadeResult {
    // Check cache first
    const cacheKey = `${seat.id}-${sunRayDirection.x}-${sunRayDirection.y}-${sunRayDirection.z}`;
    if (this.seatCache.has(cacheKey)) {
      return this.seatCache.get(cacheKey)!;
    }
    
    // Use BVH for intersection testing
    const intersectingObstructions = this.traverseBVH(
      this.bvhRoot,
      seat.position,
      sunRayDirection
    );
    
    let totalOpacity = 0;
    const obstructedBy: string[] = [];
    
    for (const obs of intersectingObstructions) {
      obstructedBy.push(obs.id);
      totalOpacity += obs.opacity || 1;
    }
    
    totalOpacity = Math.min(1, totalOpacity);
    
    const result: ShadeResult = {
      seatId: seat.id,
      inShade: totalOpacity > 0.5,
      obstructedBy: obstructedBy.length > 0 ? obstructedBy : undefined,
      shadeFraction: totalOpacity
    };
    
    // Cache result
    this.seatCache.set(cacheKey, result);
    
    return result;
  }
  
  /**
   * Unit vector pointing FROM a seat TOWARD the sun, in the stadium's own
   * local coordinate frame. Cached by sun position.
   *
   * REWRITTEN 2026-08-07. The previous version was wrong three ways at once,
   * which left the whole ray-cast occlusion path unable to find a roof:
   *
   *  1. It returned the direction sunlight TRAVELS (note the leading minus on
   *     every component, including `z: -sin(elevation)`). Callers then cast
   *     that ray from the seat, i.e. downward into the ground. An obstruction
   *     ABOVE a seat — which is the only kind that can shade it — sits behind
   *     that ray and was never intersected. Occlusion testing has to march
   *     from the seat toward the light source.
   *  2. It mixed frames. The 3D model is built by `polarTo3D` in STADIUM-LOCAL
   *     polar coordinates (+x toward first base, +y toward center field), but
   *     this used the absolute COMPASS azimuth, so the sun was placed as if
   *     every park were oriented identically.
   *  3. It swapped the axes: `polarTo3D` uses x = d·cos(angle), y = d·sin(angle),
   *     while this used x = −sin, y = −cos — a reflection plus a 90° rotation
   *     on top of the other two errors.
   */
  private getSunRayDirection(sunPos: SunPosition): Vector3D {
    const cacheKey = `${sunPos.azimuth}-${sunPos.elevation}-${this.stadium.orientation}`;
    if (this.sunDirectionCache.has(cacheKey)) {
      return this.sunDirectionCache.get(cacheKey)!;
    }

    // Compass bearing → stadium-local angle, the same conversion the section
    // geometry uses: local = orientation + 90 − compass.
    const localDeg = ((this.stadium.orientation + 90 - sunPos.azimuth) % 360 + 360) % 360;
    const localRad = localDeg * Math.PI / 180;
    const elevationRad = sunPos.elevationRadians;
    const horizontal = Math.cos(elevationRad);

    const direction = {
      x: horizontal * Math.cos(localRad),
      y: horizontal * Math.sin(localRad),
      z: Math.sin(elevationRad)
    };

    this.sunDirectionCache.set(cacheKey, direction);
    return direction;
  }
  
  // Batch process sections with level of detail
  calculateSectionShadeOptimized(
    section: SectionGeometry,
    sunPosition: SunPosition,
    lodLevel: 'high' | 'medium' | 'low' = 'medium'
  ): SectionShadeResult {
    const sunRayDirection = this.getSunRayDirection(sunPosition);
    
    // Night time optimization
    if (sunPosition.elevation <= 0) {
      return this.createFullShadeResult(section);
    }
    
    // Determine sampling rate based on LOD
    let sampleRate = 1;
    switch (lodLevel) {
      case 'low':
        sampleRate = 4; // Sample every 4th seat
        break;
      case 'medium':
        sampleRate = 2; // Sample every 2nd seat
        break;
      case 'high':
        sampleRate = 1; // Sample all seats
        break;
    }
    
    // The ray-cast alone cannot find the dominant shade mechanism in a
    // ballpark. `generateStadiumObstructions` models only a roof ring and a
    // ring of upper-deck slabs; the grandstand structure that rises BEHIND
    // each section — the thing that actually puts the sun-side half of every
    // bowl in shadow — is not in the obstruction set at all. So a request for
    // `?use3d=true`, advertised as the most precise method available, returned
    // LESS shade than the plain 2D path. Combine the ray-cast with the same
    // analytic bowl model the rest of the site uses, per seat.
    const sectionCompassDeg = sectionCompassAngle(
      { baseAngle: section.baseAngle, angleSpan: section.angleSpan },
      this.stadium.orientation,
    );
    const { sunBehind } = sunIncidence(sunPosition.azimuth, sectionCompassDeg);
    const backReachFt = shadowReachFt(
      BOWL_DEFAULTS.backStructureHeightFt[(section.level as SeatingLevel)] ?? 45,
      sunPosition.elevation,
    );
    // Seats are laid out radially outward from home plate, so the largest
    // radius in the section is its back row — where the structure behind it
    // starts throwing shadow forward.
    const radial = (s: Seat) => Math.hypot(s.position.x, s.position.y);
    const maxRadiusFt = section.seats.length ? Math.max(...section.seats.map(radial)) : 0;
    const EDGE_SOFTEN_FT = 3;

    const bowlShadeForSeat = (seat: Seat): number => {
      if (!Number.isFinite(backReachFt)) return sunBehind;
      const distanceFromBackFt = maxRadiusFt - radial(seat);
      const frac = Math.max(0, Math.min(1, (backReachFt - distanceFromBackFt) / EDGE_SOFTEN_FT));
      return sunBehind * frac;
    };

    const seatResults: ShadeResult[] = [];
    let seatsInShade = 0;
    let sampledSeats = 0;

    for (let i = 0; i < section.seats.length; i += sampleRate) {
      const seat = section.seats[i];
      const cast = this.isSeatInShadeOptimized(seat, sunRayDirection);
      // Two descriptions of the same physical occlusion at different
      // fidelities — take the stronger, never the sum, so nothing is
      // double-counted.
      const shadeFraction = Math.max(cast.shadeFraction, bowlShadeForSeat(seat));
      const result: ShadeResult = {
        ...cast,
        shadeFraction,
        inShade: shadeFraction > 0.5,
      };
      seatResults.push(result);

      if (result.inShade) {
        seatsInShade += sampleRate;
      }
      sampledSeats++;
    }
    
    // Interpolate for unsampled seats if using LOD
    if (sampleRate > 1) {
      for (let i = 0; i < section.seats.length; i++) {
        if (i % sampleRate !== 0) {
          const nearestSampledIndex = Math.floor(i / sampleRate) * sampleRate;
          const nearestResult = seatResults[nearestSampledIndex / sampleRate];
          seatResults.push({
            seatId: section.seats[i].id,
            inShade: nearestResult.inShade,
            obstructedBy: nearestResult.obstructedBy,
            shadeFraction: nearestResult.shadeFraction
          });
        }
      }
    }
    
    return {
      sectionId: section.id,
      percentageInShade: (seatsInShade / section.seats.length) * 100,
      seatsInShade,
      totalSeats: section.seats.length,
      seatResults
    };
  }
  
  // Process all sections with adaptive LOD based on performance
  calculateAllSectionsShade(
    sunPosition: SunPosition
  ): Map<string, SectionShadeResult> {
    return this.calculateAllSectionsOptimized(sunPosition);
  }
  
  calculateAllSectionsOptimized(
    sunPosition: SunPosition,
    targetFrameTime: number = 16 // Target 60fps
  ): Map<string, SectionShadeResult> {
    const results = new Map<string, SectionShadeResult>();
    const startTime = performance.now();
    
    // Sort sections by importance (e.g., lower sections first)
    const sortedSections = [...this.stadium.sections].sort((a, b) => {
      const levelOrder = { 'field': 0, 'lower': 1, 'club': 2, 'suite': 3, 'upper': 4 };
      return (levelOrder[a.level] || 5) - (levelOrder[b.level] || 5);
    });
    
    let currentLOD: 'high' | 'medium' | 'low' = 'high';
    
    for (let i = 0; i < sortedSections.length; i++) {
      const section = sortedSections[i];
      
      // Adjust LOD based on time spent
      const elapsed = performance.now() - startTime;
      const averageTimePerSection = elapsed / (i + 1);
      const remainingSections = sortedSections.length - i - 1;
      const estimatedRemainingTime = averageTimePerSection * remainingSections;
      
      if (estimatedRemainingTime + elapsed > targetFrameTime * 2) {
        currentLOD = 'low';
      } else if (estimatedRemainingTime + elapsed > targetFrameTime) {
        currentLOD = 'medium';
      }
      
      const result = this.calculateSectionShadeOptimized(section, sunPosition, currentLOD);
      results.set(section.id, result);
    }
    
    return results;
  }
  
  // Quick estimation using section centroids
  estimateSectionShade(
    section: SectionGeometry,
    sunPosition: SunPosition
  ): number {
    return this.estimateSectionShadeQuick(section, sunPosition);
  }
  
  estimateSectionShadeQuick(
    section: SectionGeometry,
    sunPosition: SunPosition
  ): number {
    const sunRayDirection = this.getSunRayDirection(sunPosition);
    
    // Sample center and corners
    const samplePoints: Vector3D[] = [
      this.calculateSectionCenter(section),
      section.vertices[0],
      section.vertices[section.vertices.length - 1]
    ];
    
    let shadedSamples = 0;
    
    for (const point of samplePoints) {
      const intersections = this.traverseBVH(this.bvhRoot, point, sunRayDirection);
      if (intersections.length > 0) {
        shadedSamples++;
      }
    }
    
    // Structural (non-ray-cast) shade from the bowl itself.
    //
    // REWRITTEN 2026-08-07. This used to compute
    //     angleDiff = |(sunAzimuthRad − orientationRad) − sectionBaseAngleRad|
    // and then apply `angleDiff > π/2 ? 0.7 : 0`. Three defects:
    //   - the conversion between compass and stadium-local was wrong (a bare
    //     subtraction of the orientation, missing the 90° term and the sign
    //     flip that `sectionCompassAngle` applies);
    //   - `angleDiff` was never wrapped into [0, 180], so it could exceed π
    //     and the comparison meant nothing for half the bowl;
    //   - the branch was INVERTED — it awarded 0.7 shade to sections more than
    //     90° from the sun, which are the ones with the light in their faces.
    const sectionCompassDeg = sectionCompassAngle(
      { baseAngle: section.baseAngle, angleSpan: section.angleSpan },
      this.stadium.orientation,
    );
    const naturalShade = structuralShadeFraction({
      sunAltitudeDeg: sunPosition.elevation,
      sunAzimuthDeg: sunPosition.azimuth,
      sectionCompassDeg,
      level: section.level as SeatingLevel,
    });
    const obstructionShade = (shadedSamples / samplePoints.length);

    return Math.min(1, naturalShade + obstructionShade) * 100;
  }
  
  private calculateSectionCenter(section: SectionGeometry): Vector3D {
    if (section.vertices.length === 0) {
      return { x: 0, y: 0, z: 0 };
    }
    
    const sum = section.vertices.reduce(
      (acc, v) => ({
        x: acc.x + v.x,
        y: acc.y + v.y,
        z: acc.z + v.z
      }),
      { x: 0, y: 0, z: 0 }
    );
    
    return {
      x: sum.x / section.vertices.length,
      y: sum.y / section.vertices.length,
      z: sum.z / section.vertices.length
    };
  }
  
  private createFullShadeResult(section: SectionGeometry): SectionShadeResult {
    return {
      sectionId: section.id,
      percentageInShade: 100,
      seatsInShade: section.seats.length,
      totalSeats: section.seats.length,
      seatResults: section.seats.map(seat => ({
        seatId: seat.id,
        inShade: true,
        shadeFraction: 1
      }))
    };
  }
  
  // Clear caches to free memory
  clearCaches(): void {
    this.seatCache.clear();
    this.sunDirectionCache.clear();
  }
  
  // Cleanup
  destroy(): void {
    this.clearCaches();
    if (this.workerPool) {
      this.workerPool.forEach(worker => worker.terminate());
      this.workerPool = undefined;
    }
  }
}

// Helper function to convert degrees to radians
export function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Helper function to create sun position from azimuth and elevation
export function createSunPosition(azimuthDegrees: number, elevationDegrees: number): SunPosition {
  return {
    azimuth: azimuthDegrees,
    elevation: elevationDegrees,
    azimuthRadians: degreesToRadians(azimuthDegrees),
    elevationRadians: degreesToRadians(elevationDegrees)
  };
}

// Export optimized calculator as default
export { OptimizedShadeCalculator3D as ShadeCalculator3D };