// Advanced Shadow Calculator with 3D Obstruction Support
// Calculates accurate shadows using ray-casting through obstructions

import { Vector3D, DetailedSection, Obstruction3D } from '../types/stadium-complete';
import { SunPosition } from './sunCalculations';

export interface ShadowResult {
  sectionId: string;
  shadowPercentage: number; // 0-100, percentage of section in shadow
  sunExposure: number; // 0-100, inverse of shadow
  partialShade: boolean;
  obstructionsCasting: string[]; // IDs of obstructions causing shadows
}

// Ray-sphere intersection for light towers
function raySphereIntersect(
  rayOrigin: Vector3D,
  rayDirection: Vector3D,
  sphereCenter: Vector3D,
  sphereRadius: number
): boolean {
  const oc = {
    x: rayOrigin.x - sphereCenter.x,
    y: rayOrigin.y - sphereCenter.y,
    z: rayOrigin.z - sphereCenter.z
  };
  
  const a = rayDirection.x * rayDirection.x + 
            rayDirection.y * rayDirection.y + 
            rayDirection.z * rayDirection.z;
  const b = 2 * (oc.x * rayDirection.x + oc.y * rayDirection.y + oc.z * rayDirection.z);
  const c = oc.x * oc.x + oc.y * oc.y + oc.z * oc.z - sphereRadius * sphereRadius;
  
  const discriminant = b * b - 4 * a * c;
  return discriminant >= 0;
}

// Ray-box intersection for overhangs and structures
function rayBoxIntersect(
  rayOrigin: Vector3D,
  rayDirection: Vector3D,
  boxMin: Vector3D,
  boxMax: Vector3D
): boolean {
  let tmin = (boxMin.x - rayOrigin.x) / rayDirection.x;
  let tmax = (boxMax.x - rayOrigin.x) / rayDirection.x;
  
  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
  
  let tymin = (boxMin.y - rayOrigin.y) / rayDirection.y;
  let tymax = (boxMax.y - rayOrigin.y) / rayDirection.y;
  
  if (tymin > tymax) [tymin, tymax] = [tymax, tymin];
  
  if ((tmin > tymax) || (tymin > tmax)) return false;
  
  if (tymin > tmin) tmin = tymin;
  if (tymax < tmax) tmax = tymax;
  
  let tzmin = (boxMin.z - rayOrigin.z) / rayDirection.z;
  let tzmax = (boxMax.z - rayOrigin.z) / rayDirection.z;
  
  if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];
  
  return !((tmin > tzmax) || (tzmin > tmax));
}

// Calculate sun ray direction from sun position
function getSunRayDirection(sunPosition: SunPosition): Vector3D {
  // Convert spherical coordinates to Cartesian
  const azimuthRad = sunPosition.azimuth;
  const altitudeRad = sunPosition.altitude;
  
  return {
    x: Math.cos(altitudeRad) * Math.sin(azimuthRad),
    y: Math.sin(altitudeRad),
    z: Math.cos(altitudeRad) * Math.cos(azimuthRad)
  };
}

// Check if a point is in shadow from any obstruction
function isPointInShadow(
  point: Vector3D,
  sunDirection: Vector3D,
  obstructions: Obstruction3D[]
): { inShadow: boolean; obstructionIds: string[] } {
  const obstructionIds: string[] = [];
  
  // Ray starts from the point and goes toward the sun
  const rayOrigin = point;
  const rayDirection = {
    x: -sunDirection.x,
    y: -sunDirection.y,
    z: -sunDirection.z
  };
  
  for (const obstruction of obstructions) {
    if (!obstruction.castsShadow) continue;
    
    // Check ray-box intersection with obstruction's bounding box
    if (rayBoxIntersect(
      rayOrigin,
      rayDirection,
      obstruction.boundingBox.min,
      obstruction.boundingBox.max
    )) {
      obstructionIds.push(obstruction.id);
    }
  }
  
  return {
    inShadow: obstructionIds.length > 0,
    obstructionIds
  };
}

// Calculate shadow coverage for a section
export function calculateSectionShadow(
  section: DetailedSection,
  sunPosition: SunPosition,
  obstructions: Obstruction3D[]
): ShadowResult {
  // Skip calculation if sun is below horizon
  if (sunPosition.altitudeDegrees < 0) {
    return {
      sectionId: section.id,
      shadowPercentage: 100,
      sunExposure: 0,
      partialShade: false,
      obstructionsCasting: []
    };
  }
  
  // Covered sections are always in shade
  if (section.covered) {
    return {
      sectionId: section.id,
      shadowPercentage: 100,
      sunExposure: 0,
      partialShade: false,
      obstructionsCasting: ['roof']
    };
  }
  
  const sunDirection = getSunRayDirection(sunPosition);
  const vertices = section.vertices3D;
  
  // Sample multiple points across the section
  const samplePoints: Vector3D[] = [];
  const numSamples = 9; // 3x3 grid
  
  for (let i = 0; i < numSamples; i++) {
    const u = (i % 3) / 2;
    const v = Math.floor(i / 3) / 2;
    
    // Bilinear interpolation across the section quad
    const point: Vector3D = {
      x: (1 - u) * (1 - v) * vertices[0].x +
         u * (1 - v) * vertices[1].x +
         u * v * vertices[2].x +
         (1 - u) * v * vertices[3].x,
      y: (1 - u) * (1 - v) * vertices[0].y +
         u * (1 - v) * vertices[1].y +
         u * v * vertices[2].y +
         (1 - u) * v * vertices[3].y,
      z: (1 - u) * (1 - v) * vertices[0].z +
         u * (1 - v) * vertices[1].z +
         u * v * vertices[2].z +
         (1 - u) * v * vertices[3].z
    };
    
    samplePoints.push(point);
  }
  
  // Check shadow for each sample point
  let shadowedPoints = 0;
  const allObstructionIds = new Set<string>();
  
  for (const point of samplePoints) {
    const shadowCheck = isPointInShadow(point, sunDirection, obstructions);
    if (shadowCheck.inShadow) {
      shadowedPoints++;
      shadowCheck.obstructionIds.forEach(id => allObstructionIds.add(id));
    }
  }
  
  const shadowPercentage = (shadowedPoints / samplePoints.length) * 100;
  const partialShade = shadowedPoints > 0 && shadowedPoints < samplePoints.length;
  
  return {
    sectionId: section.id,
    shadowPercentage: Math.round(shadowPercentage),
    sunExposure: Math.round(100 - shadowPercentage),
    partialShade,
    obstructionsCasting: Array.from(allObstructionIds)
  };
}

// Calculate shadows for all sections
export function calculateAllShadows(
  sections: DetailedSection[],
  sunPosition: SunPosition,
  obstructions: Obstruction3D[]
): Map<string, ShadowResult> {
  const shadowMap = new Map<string, ShadowResult>();
  
  for (const section of sections) {
    const shadow = calculateSectionShadow(section, sunPosition, obstructions);
    shadowMap.set(section.id, shadow);
  }
  
  return shadowMap;
}

// Calculate shadow progression over time
export function calculateShadowProgression(
  sections: DetailedSection[],
  obstructions: Obstruction3D[],
  sunPositions: { time: Date; position: SunPosition }[],
  weatherMultiplier: number = 1.0
): Map<string, number[]> {
  const progressionMap = new Map<string, number[]>();
  
  // Initialize arrays for each section
  sections.forEach(section => {
    progressionMap.set(section.id, []);
  });
  
  // Calculate shadows for each time point
  for (const { position } of sunPositions) {
    const shadows = calculateAllShadows(sections, position, obstructions);
    
    shadows.forEach((shadow, sectionId) => {
      const progression = progressionMap.get(sectionId) || [];
      // Apply weather multiplier to sun exposure
      const adjustedExposure = shadow.sunExposure * weatherMultiplier;
      progression.push(Math.min(100, adjustedExposure));
      progressionMap.set(sectionId, progression);
    });
  }
  
  return progressionMap;
}

// Find the best shaded sections
export function findBestShadedSections(
  shadows: Map<string, ShadowResult>,
  minShadowPercentage: number = 50
): string[] {
  const shadedSections: Array<{ id: string; shadow: number }> = [];
  
  shadows.forEach((result, sectionId) => {
    if (result.shadowPercentage >= minShadowPercentage) {
      shadedSections.push({ id: sectionId, shadow: result.shadowPercentage });
    }
  });
  
  // Sort by shadow percentage (most shaded first)
  shadedSections.sort((a, b) => b.shadow - a.shadow);
  
  return shadedSections.map(s => s.id);
}

// Calculate average sun exposure for a game duration
export function calculateGameAverageSunExposure(
  sectionId: string,
  progression: number[],
  gameDurationHours: number = 3
): number {
  if (!progression || progression.length === 0) return 0;
  
  // Sample points based on game duration
  const samplesPerHour = Math.ceil(progression.length / gameDurationHours);
  let totalExposure = 0;
  let sampleCount = 0;
  
  for (let i = 0; i < progression.length && i < samplesPerHour * gameDurationHours; i++) {
    totalExposure += progression[i];
    sampleCount++;
  }
  
  return sampleCount > 0 ? Math.round(totalExposure / sampleCount) : 0;
}