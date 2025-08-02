// 3D Shade Calculation Engine with Ray-Casting
// Provides precise shade detection using 3D geometry and obstruction modeling

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

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
  elevation: number; // Degrees above horizon (0-90)
  azimuthRadians: number;
  elevationRadians: number;
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

// Ray-casting algorithm for shade detection
export class ShadeCalculator3D {
  private stadium: Stadium3DModel;
  private sunPosition?: SunPosition;
  
  constructor(stadium: Stadium3DModel) {
    this.stadium = stadium;
  }
  
  // Calculate sun ray direction vector
  private getSunRayDirection(sunPos: SunPosition): Vector3D {
    const azimuthRad = sunPos.azimuthRadians;
    const elevationRad = sunPos.elevationRadians;
    
    // Convert spherical coordinates to Cartesian
    // Note: We negate because rays come FROM the sun
    return {
      x: -Math.sin(azimuthRad) * Math.cos(elevationRad),
      y: -Math.cos(azimuthRad) * Math.cos(elevationRad),
      z: -Math.sin(elevationRad)
    };
  }
  
  // Check if a ray intersects with an axis-aligned bounding box (AABB)
  private rayIntersectsAABB(
    rayOrigin: Vector3D,
    rayDirection: Vector3D,
    boxMin: Vector3D,
    boxMax: Vector3D
  ): boolean {
    // Using the slab method for ray-AABB intersection
    let tMin = -Infinity;
    let tMax = Infinity;
    
    // Check each axis
    for (const axis of ['x', 'y', 'z'] as const) {
      if (Math.abs(rayDirection[axis]) < 1e-6) {
        // Ray is parallel to slab
        if (rayOrigin[axis] < boxMin[axis] || rayOrigin[axis] > boxMax[axis]) {
          return false;
        }
      } else {
        // Compute intersection distances
        const t1 = (boxMin[axis] - rayOrigin[axis]) / rayDirection[axis];
        const t2 = (boxMax[axis] - rayOrigin[axis]) / rayDirection[axis];
        
        tMin = Math.max(tMin, Math.min(t1, t2));
        tMax = Math.min(tMax, Math.max(t1, t2));
        
        if (tMin > tMax || tMax < 0) {
          return false;
        }
      }
    }
    
    return tMin <= tMax && tMax >= 0;
  }
  
  // Check if a seat is in shade
  private isSeatInShade(seat: Seat, sunRayDirection: Vector3D): ShadeResult {
    const obstructedBy: string[] = [];
    let totalOpacity = 0;
    
    // Cast ray from seat towards sun
    for (const obstruction of this.stadium.obstructions) {
      if (this.rayIntersectsAABB(
        seat.position,
        sunRayDirection,
        obstruction.boundingBox.min,
        obstruction.boundingBox.max
      )) {
        obstructedBy.push(obstruction.id);
        totalOpacity += obstruction.opacity || 1;
      }
    }
    
    // Clamp opacity to [0, 1]
    totalOpacity = Math.min(1, totalOpacity);
    
    return {
      seatId: seat.id,
      inShade: totalOpacity > 0.5, // Consider in shade if more than 50% blocked
      obstructedBy: obstructedBy.length > 0 ? obstructedBy : undefined,
      shadeFraction: totalOpacity
    };
  }
  
  // Calculate shade for all seats in a section
  calculateSectionShade(
    section: SectionGeometry,
    sunPosition: SunPosition
  ): SectionShadeResult {
    this.sunPosition = sunPosition;
    const sunRayDirection = this.getSunRayDirection(sunPosition);
    
    // If sun is below horizon, everything is in shade
    if (sunPosition.elevation <= 0) {
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
    
    // Calculate shade for each seat
    const seatResults: ShadeResult[] = [];
    let seatsInShade = 0;
    
    for (const seat of section.seats) {
      const result = this.isSeatInShade(seat, sunRayDirection);
      seatResults.push(result);
      if (result.inShade) {
        seatsInShade++;
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
  
  // Calculate shade for all sections (with optimization)
  calculateAllSectionsShade(sunPosition: SunPosition): Map<string, SectionShadeResult> {
    const results = new Map<string, SectionShadeResult>();
    
    // Early exit for night time
    if (sunPosition.elevation <= 0) {
      for (const section of this.stadium.sections) {
        results.set(section.id, {
          sectionId: section.id,
          percentageInShade: 100,
          seatsInShade: section.seats.length,
          totalSeats: section.seats.length,
          seatResults: section.seats.map(seat => ({
            seatId: seat.id,
            inShade: true,
            shadeFraction: 1
          }))
        });
      }
      return results;
    }
    
    // Process sections in parallel batches for performance
    const batchSize = 10;
    for (let i = 0; i < this.stadium.sections.length; i += batchSize) {
      const batch = this.stadium.sections.slice(i, i + batchSize);
      
      for (const section of batch) {
        const result = this.calculateSectionShade(section, sunPosition);
        results.set(section.id, result);
      }
    }
    
    return results;
  }
  
  // Optimized method for quick section-level estimates
  estimateSectionShade(
    section: SectionGeometry,
    sunPosition: SunPosition
  ): number {
    // Use section center point for quick estimate
    const centerPoint = this.calculateSectionCenter(section);
    const sunRayDirection = this.getSunRayDirection(sunPosition);
    
    // Check major obstructions
    let maxOpacity = 0;
    for (const obstruction of this.stadium.obstructions) {
      if (this.rayIntersectsAABB(
        centerPoint,
        sunRayDirection,
        obstruction.boundingBox.min,
        obstruction.boundingBox.max
      )) {
        maxOpacity = Math.max(maxOpacity, obstruction.opacity || 1);
      }
    }
    
    // Consider section angle relative to sun
    const sectionAzimuth = (section.baseAngle + section.angleSpan / 2) * Math.PI / 180;
    const sunAzimuthAdjusted = sunPosition.azimuthRadians - (this.stadium.orientation * Math.PI / 180);
    const angleDiff = Math.abs(sunAzimuthAdjusted - sectionAzimuth);
    
    // Sections facing away from sun get natural shade
    const naturalShade = angleDiff > Math.PI / 2 ? 0.7 : 0;
    
    return Math.min(1, maxOpacity + naturalShade) * 100;
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