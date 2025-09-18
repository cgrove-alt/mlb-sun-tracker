// Enhanced 3D Shade Calculation with Soft Shadows and Penumbra
// Provides photorealistic shade calculations using advanced ray-tracing

import { Vector3D, Obstruction, SunPosition } from './shadeCalculation3D';
import { getStadiumDimensions } from '../data/stadiumGeometryDetailed';

export interface RayTracingConfig {
  samplesPerPixel: number; // Number of rays per calculation point
  penumbraRadius: number; // Sun's angular size for soft shadows (0.53 degrees)
  atmosphericScattering: boolean; // Model atmospheric effects
  reflectedLight: boolean; // Calculate light bounces
  maxBounces: number; // Maximum light bounces to calculate
}

export interface EnhancedShadeResult {
  position: Vector3D;
  directSunlight: number; // 0-1, amount of direct sunlight
  diffuseLight: number; // 0-1, amount of scattered/reflected light
  totalLight: number; // Combined light value
  inUmbra: boolean; // Fully shaded
  inPenumbra: boolean; // Partially shaded
  shadowSharpness: number; // 0-1, how sharp the shadow edge is
}

export class EnhancedShadeCalculator {
  private config: RayTracingConfig;
  
  constructor(config?: Partial<RayTracingConfig>) {
    this.config = {
      samplesPerPixel: 16,
      penumbraRadius: 0.53, // Sun's angular diameter in degrees
      atmosphericScattering: true,
      reflectedLight: true,
      maxBounces: 2,
      ...config,
    };
  }
  
  // Calculate sun disk samples for soft shadows
  private getSunDiskSamples(sunDirection: Vector3D, numSamples: number): Vector3D[] {
    const samples: Vector3D[] = [];
    const sunRadius = Math.tan(this.config.penumbraRadius * Math.PI / 180);
    
    // Create orthogonal basis vectors
    const up = Math.abs(sunDirection.z) < 0.99 
      ? { x: 0, y: 0, z: 1 } 
      : { x: 1, y: 0, z: 0 };
    
    const right = this.crossProduct(sunDirection, up);
    const forward = this.crossProduct(right, sunDirection);
    
    // Stratified sampling of sun disk
    const sqrtSamples = Math.sqrt(numSamples);
    for (let i = 0; i < numSamples; i++) {
      const u = (i % sqrtSamples) / sqrtSamples + Math.random() / sqrtSamples;
      const v = Math.floor(i / sqrtSamples) / sqrtSamples + Math.random() / sqrtSamples;
      
      // Convert to disk coordinates
      const theta = 2 * Math.PI * u;
      const r = sunRadius * Math.sqrt(v);
      
      // Create sample direction
      const offsetX = r * Math.cos(theta);
      const offsetY = r * Math.sin(theta);
      
      const sample = {
        x: sunDirection.x + right.x * offsetX + forward.x * offsetY,
        y: sunDirection.y + right.y * offsetX + forward.y * offsetY,
        z: sunDirection.z + right.z * offsetX + forward.z * offsetY,
      };
      
      samples.push(this.normalize(sample));
    }
    
    return samples;
  }
  
  // Calculate atmospheric scattering (Rayleigh scattering)
  private calculateAtmosphericScattering(sunElevation: number): number {
    if (!this.config.atmosphericScattering) return 1.0;
    
    // Simplified Rayleigh scattering model
    const zenithAngle = 90 - sunElevation;
    const airMass = 1 / Math.cos(zenithAngle * Math.PI / 180);
    
    // Scattering increases near horizon
    const scattering = Math.exp(-0.12 * airMass);
    
    // Add color temperature shift (not implemented in this simplified version)
    return Math.max(0.3, scattering);
  }
  
  // Calculate diffuse sky light based on obstruction
  private calculateDiffuseLight(
    position: Vector3D,
    obstructions: Obstruction[],
    sunPosition: SunPosition
  ): number {
    // Sample hemisphere above the point
    const numSamples = 8;
    let visibleSky = 0;
    
    for (let i = 0; i < numSamples; i++) {
      const theta = Math.random() * Math.PI / 2; // 0 to 90 degrees
      const phi = Math.random() * 2 * Math.PI;
      
      const skyDirection = {
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
      };
      
      if (!this.isObstructed(position, skyDirection, obstructions, Infinity)) {
        visibleSky++;
      }
    }
    
    // Base diffuse light on sky visibility and sun elevation
    const skyVisibility = visibleSky / numSamples;
    const sunInfluence = Math.max(0, Math.sin(sunPosition.elevationRadians));
    
    return skyVisibility * sunInfluence * 0.3; // Diffuse is ~30% of direct
  }
  
  // Calculate reflected light from nearby surfaces
  private calculateReflectedLight(
    position: Vector3D,
    sunDirection: Vector3D,
    obstructions: Obstruction[],
    bounce: number = 0
  ): number {
    if (!this.config.reflectedLight || bounce >= this.config.maxBounces) {
      return 0;
    }
    
    // Simplified reflection calculation
    // In a real implementation, this would trace secondary rays
    const groundReflection = 0.15; // Grass/concrete albedo
    const structureReflection = 0.25; // Building albedo
    
    // Check if ground is lit
    const groundLit = !this.isObstructed(
      { x: position.x, y: position.y, z: 0 },
      sunDirection,
      obstructions,
      1000
    );
    
    return groundLit ? groundReflection * 0.1 : 0;
  }
  
  // Enhanced shade calculation with soft shadows
  public calculateShade(
    position: Vector3D,
    sunPosition: SunPosition,
    obstructions: Obstruction[]
  ): EnhancedShadeResult {
    // Get base sun direction
    const sunDirection = this.getSunDirection(sunPosition);
    
    // Sample sun disk for soft shadows
    const sunSamples = this.getSunDiskSamples(sunDirection, this.config.samplesPerPixel);
    
    // Calculate direct sunlight with penumbra
    let litSamples = 0;
    let totalOpacity = 0;
    
    for (const sample of sunSamples) {
      const obstructed = this.isObstructed(position, sample, obstructions, 1000);
      if (!obstructed) {
        litSamples++;
      } else {
        // Calculate partial obstruction for translucent materials
        const opacity = this.getObstructionOpacity(position, sample, obstructions);
        totalOpacity += opacity;
      }
    }
    
    const directSunlight = litSamples / sunSamples.length;
    const averageOpacity = totalOpacity / sunSamples.length;
    
    // Apply atmospheric scattering
    const atmosphericFactor = this.calculateAtmosphericScattering(sunPosition.elevation);
    const adjustedDirectLight = directSunlight * atmosphericFactor;
    
    // Calculate diffuse and reflected light
    const diffuseLight = this.calculateDiffuseLight(position, obstructions, sunPosition);
    const reflectedLight = this.calculateReflectedLight(position, sunDirection, obstructions);
    
    // Combine all light contributions
    const totalLight = Math.min(1, adjustedDirectLight + diffuseLight + reflectedLight);
    
    // Determine shadow type
    const inUmbra = directSunlight === 0;
    const inPenumbra = directSunlight > 0 && directSunlight < 1;
    
    // Calculate shadow sharpness (how defined the edge is)
    const shadowSharpness = inPenumbra 
      ? 1 - (Math.abs(directSunlight - 0.5) * 2) 
      : 1;
    
    return {
      position,
      directSunlight: adjustedDirectLight,
      diffuseLight,
      totalLight,
      inUmbra,
      inPenumbra,
      shadowSharpness,
    };
  }
  
  // Ray-obstruction intersection with opacity support
  private isObstructed(
    origin: Vector3D,
    direction: Vector3D,
    obstructions: Obstruction[],
    maxDistance: number
  ): boolean {
    for (const obstruction of obstructions) {
      if (this.rayIntersectsBox(origin, direction, obstruction.boundingBox, maxDistance)) {
        // For now, treat all obstructions as opaque
        // In a full implementation, we'd accumulate opacity
        return true;
      }
    }
    return false;
  }
  
  // Get total opacity along a ray
  private getObstructionOpacity(
    origin: Vector3D,
    direction: Vector3D,
    obstructions: Obstruction[]
  ): number {
    let totalOpacity = 0;
    
    for (const obstruction of obstructions) {
      if (this.rayIntersectsBox(origin, direction, obstruction.boundingBox, 1000)) {
        totalOpacity += obstruction.opacity || 1;
      }
    }
    
    return Math.min(1, totalOpacity);
  }
  
  // Ray-box intersection test
  private rayIntersectsBox(
    origin: Vector3D,
    direction: Vector3D,
    box: { min: Vector3D; max: Vector3D },
    maxDistance: number
  ): boolean {
    let tMin = 0;
    let tMax = maxDistance;
    
    for (const axis of ['x', 'y', 'z'] as const) {
      const invD = 1 / direction[axis];
      let t0 = (box.min[axis] - origin[axis]) * invD;
      let t1 = (box.max[axis] - origin[axis]) * invD;

      if (invD < 0) {
        [t0, t1] = [t1, t0];
      }
      
      tMin = Math.max(tMin, t0);
      tMax = Math.min(tMax, t1);
      
      if (tMax < tMin) {
        return false;
      }
    }
    
    return true;
  }
  
  // Vector math utilities
  private getSunDirection(sunPos: SunPosition): Vector3D {
    return {
      x: -Math.sin(sunPos.azimuthRadians) * Math.cos(sunPos.elevationRadians),
      y: -Math.cos(sunPos.azimuthRadians) * Math.cos(sunPos.elevationRadians),
      z: -Math.sin(sunPos.elevationRadians),
    };
  }
  
  private normalize(v: Vector3D): Vector3D {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return {
      x: v.x / len,
      y: v.y / len,
      z: v.z / len,
    };
  }
  
  private crossProduct(a: Vector3D, b: Vector3D): Vector3D {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
  }
  
  // Batch calculation for performance
  public calculateShadeBatch(
    positions: Vector3D[],
    sunPosition: SunPosition,
    obstructions: Obstruction[]
  ): EnhancedShadeResult[] {
    // Pre-calculate shared values
    const atmosphericFactor = this.calculateAtmosphericScattering(sunPosition.elevation);
    const sunDirection = this.getSunDirection(sunPosition);
    const sunSamples = this.getSunDiskSamples(sunDirection, this.config.samplesPerPixel);
    
    // Process positions in parallel (in a real implementation)
    return positions.map(position => 
      this.calculateShade(position, sunPosition, obstructions)
    );
  }
  
  // Progressive refinement for real-time updates
  public calculateShadeProgressive(
    position: Vector3D,
    sunPosition: SunPosition,
    obstructions: Obstruction[],
    quality: 'low' | 'medium' | 'high' = 'medium'
  ): EnhancedShadeResult {
    // Adjust samples based on quality
    const originalSamples = this.config.samplesPerPixel;
    
    switch (quality) {
      case 'low':
        this.config.samplesPerPixel = 4;
        break;
      case 'medium':
        this.config.samplesPerPixel = 8;
        break;
      case 'high':
        this.config.samplesPerPixel = 16;
        break;
    }
    
    const result = this.calculateShade(position, sunPosition, obstructions);
    
    // Restore original configuration
    this.config.samplesPerPixel = originalSamples;
    
    return result;
  }
}