// 3D Stadium Geometry Data
// Provides 3D coordinates and obstruction data for all stadium types

import { Stadium } from './stadiums';
import { StadiumSection } from './stadiumSections';
import { getStadiumObstructions } from './stadiumObstructions';
import { Vector3D } from '../types/stadium-complete';
import {
  Obstruction,
  SectionGeometry,
  Stadium3DModel,
  Seat
} from '../utils/shadeCalculation3DOptimized';

// Constants for typical stadium dimensions (in feet)
const FIELD_LEVEL_Z = 0;
const LOWER_DECK_HEIGHT = 25;
const CLUB_LEVEL_HEIGHT = 50;
const UPPER_DECK_HEIGHT = 75;
const SUITE_LEVEL_HEIGHT = 60;

const SECTION_DEPTH = 60; // Typical section depth
const ROW_HEIGHT = 2.5; // Height between rows
const SEAT_WIDTH = 2; // Width of each seat

// Convert polar coordinates to 3D position
function polarTo3D(
  angle: number, // degrees
  distance: number, // feet from home plate
  z: number // height
): Vector3D {
  const radians = angle * Math.PI / 180;
  return {
    x: distance * Math.cos(radians),
    y: distance * Math.sin(radians),
    z
  };
}

// Generate seats for a section
function generateSeatsForSection(
  section: StadiumSection,
  baseDistance: number,
  baseHeight: number,
  rowCount: number = 20,
  seatsPerRow: number = 20
): Seat[] {
  const seats: Seat[] = [];
  const angleStep = section.angleSpan / seatsPerRow;
  const depthStep = SECTION_DEPTH / rowCount;
  
  for (let row = 0; row < rowCount; row++) {
    for (let seatNum = 0; seatNum < seatsPerRow; seatNum++) {
      const angle = section.baseAngle + (seatNum * angleStep);
      const distance = baseDistance + (row * depthStep);
      const height = baseHeight + (row * ROW_HEIGHT);
      
      seats.push({
        id: `${section.id}-R${row + 1}-S${seatNum + 1}`,
        sectionId: section.id,
        row: row + 1,
        seatNumber: seatNum + 1,
        position: polarTo3D(angle, distance, height)
      });
    }
  }
  
  return seats;
}

// Generate section geometry with vertices
function generateSectionGeometry(
  section: StadiumSection,
  baseDistance: number,
  baseHeight: number
): SectionGeometry {
  // Define section corners
  const vertices: Vector3D[] = [
    // Front corners
    polarTo3D(section.baseAngle, baseDistance, baseHeight),
    polarTo3D(section.baseAngle + section.angleSpan, baseDistance, baseHeight),
    // Back corners
    polarTo3D(section.baseAngle, baseDistance + SECTION_DEPTH, baseHeight + (20 * ROW_HEIGHT)),
    polarTo3D(section.baseAngle + section.angleSpan, baseDistance + SECTION_DEPTH, baseHeight + (20 * ROW_HEIGHT))
  ];
  
  return {
    id: section.id,
    name: section.name,
    level: section.level,
    vertices,
    seats: generateSeatsForSection(section, baseDistance, baseHeight),
    baseAngle: section.baseAngle,
    angleSpan: section.angleSpan
  };
}

/**
 * Axis-aligned bounding box enclosing an annular wedge (an arc segment of the
 * bowl) between two angles, two radii and two heights.
 *
 * These boxes used to be built as
 *     min: polarTo3D(angle - half, rInner, zLow)
 *     max: polarTo3D(angle + half, rOuter, zHigh)
 * which is not a bounding box at all — it is two arbitrary corner points, and
 * for most angles the "min" corner has a LARGER x or y than the "max" corner.
 * 15 of the 21 obstructions a typical park generated were inverted this way.
 * An inverted box makes the ray/slab intersection test compute a nonsense
 * interval, so roughly three quarters of the stadium's obstruction geometry
 * was invisible to the 3D shade calculation.
 *
 * Sampling the arc (rather than taking only its endpoints) also catches the
 * case where the wedge crosses an axis and its extreme x or y lies in the
 * middle of the arc, not at either end.
 */
function arcBoundingBox(
  angleStartDeg: number,
  angleEndDeg: number,
  innerRadius: number,
  outerRadius: number,
  zMin: number,
  zMax: number,
): { min: Vector3D; max: Vector3D } {
  const min = { x: Infinity, y: Infinity, z: Math.min(zMin, zMax) };
  const max = { x: -Infinity, y: -Infinity, z: Math.max(zMin, zMax) };
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const a = angleStartDeg + ((angleEndDeg - angleStartDeg) * i) / steps;
    for (const r of [innerRadius, outerRadius]) {
      const p = polarTo3D(a, r, 0);
      min.x = Math.min(min.x, p.x);
      min.y = Math.min(min.y, p.y);
      max.x = Math.max(max.x, p.x);
      max.y = Math.max(max.y, p.y);
    }
  }
  return { min, max };
}

// Generate obstructions for a stadium
function generateStadiumObstructions(stadium: Stadium | AnyStadium): Obstruction[] {
  const obstructions: Obstruction[] = [];

  // Roof overhang (if applicable)
  if (stadium.roofOverhang && stadium.roofOverhang > 0) {
    const roofHeight = stadium.roofHeight || 120;

    // Create roof segments around the stadium
    for (let angle = 0; angle < 360; angle += 30) {
      const innerRadius = 200;
      const outerRadius = innerRadius + stadium.roofOverhang;

      obstructions.push({
        id: `roof-segment-${angle}`,
        type: 'roof',
        boundingBox: arcBoundingBox(
          angle - 15, angle + 15, innerRadius, outerRadius, roofHeight - 10, roofHeight,
        ),
        opacity: 1
      });
    }
  }

  // Upper deck overhang
  if (stadium.upperDeckHeight) {
    for (let angle = 0; angle < 360; angle += 45) {
      obstructions.push({
        id: `upper-deck-${angle}`,
        type: 'upper_deck',
        boundingBox: arcBoundingBox(
          angle - 22.5, angle + 22.5, 150, 180,
          stadium.upperDeckHeight - 5, stadium.upperDeckHeight,
        ),
        opacity: 0.9
      });
    }
  }
  
  // Stadium-specific obstructions from comprehensive data
  const specificObstructions = getStadiumObstructions(stadium.id);
  obstructions.push(...specificObstructions);
  
  return obstructions;
}

// Extended to support any stadium type (MLB, MiLB, NFL)
export interface AnyStadium {
  id: string;
  name: string;
  team?: string;
  city?: string;
  state?: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity?: number;
  roof?: 'open' | 'retractable' | 'fixed';
  timezone?: string;
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
}

// Cache for stadium 3D models
const stadium3DModelCache = new Map<string, Stadium3DModel>();

// Get or generate 3D model for any stadium type
export function getStadium3DModel(
  stadium: Stadium | AnyStadium,
  sections: StadiumSection[]
): Stadium3DModel {
  // Check cache first
  const cacheKey = stadium.id;
  if (stadium3DModelCache.has(cacheKey)) {
    return stadium3DModelCache.get(cacheKey)!;
  }
  
  // Generate section geometries
  const sectionGeometries: SectionGeometry[] = [];
  
  for (const section of sections) {
    let baseDistance: number;
    let baseHeight: number;
    
    // Set base distance and height based on level
    switch (section.level) {
      case 'field':
        baseDistance = 60;
        baseHeight = FIELD_LEVEL_Z;
        break;
      case 'lower':
        baseDistance = 150;
        baseHeight = LOWER_DECK_HEIGHT;
        break;
      case 'club':
        baseDistance = 180;
        baseHeight = CLUB_LEVEL_HEIGHT;
        break;
      case 'upper':
        baseDistance = 200;
        baseHeight = UPPER_DECK_HEIGHT;
        break;
      case 'suite':
        baseDistance = 170;
        baseHeight = SUITE_LEVEL_HEIGHT;
        break;
      default:
        baseDistance = 150;
        baseHeight = LOWER_DECK_HEIGHT;
    }
    
    const geometry = generateSectionGeometry(section, baseDistance, baseHeight);
    sectionGeometries.push(geometry);
  }
  
  // Create 3D model
  const model: Stadium3DModel = {
    id: stadium.id,
    sections: sectionGeometries,
    obstructions: generateStadiumObstructions(stadium),
    origin: { x: 0, y: 0, z: 0 }, // Home plate
    orientation: stadium.orientation
  };
  
  // Cache the model
  stadium3DModelCache.set(cacheKey, model);
  
  return model;
}

// Performance optimization: Pre-generate models for all stadiums
export function preloadAllStadium3DModels(
  stadiums: Stadium[],
  sectionsByStadium: Map<string, StadiumSection[]>
): void {
  for (const stadium of stadiums) {
    const sections = sectionsByStadium.get(stadium.id) || [];
    getStadium3DModel(stadium, sections);
  }
}

// Clear cache (useful for memory management)
export function clearStadium3DModelCache(): void {
  stadium3DModelCache.clear();
}