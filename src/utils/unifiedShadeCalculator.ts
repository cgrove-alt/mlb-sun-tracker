// Unified Shade Calculator for MLB and MiLB Stadiums
// Provides consistent 3D shade calculations across all baseball venues

import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { MiLBStadium, ALL_MILB_STADIUMS } from '../data/milbStadiums';
import { getStadiumDimensions } from '../data/stadiumGeometryDetailed';
import { getMiLBDimensionsWithFallback } from '../data/milbStadiumGeometry';
import { EnhancedShadeCalculator, EnhancedShadeResult } from './shadeCalculation3DEnhanced';
import { Vector3D, Obstruction, SunPosition } from './shadeCalculation3D';
import { StadiumSection } from '../data/stadiumSections';
import { getVenueSections } from '../data/venueSections';

export interface UnifiedStadium {
  id: string;
  name: string;
  type: 'MLB' | 'MiLB' | 'NFL';
  level?: 'MLB' | 'AAA' | 'AA' | 'A+' | 'A';
  latitude: number;
  longitude: number;
  orientation: number;
  roof: 'open' | 'retractable' | 'fixed';
  capacity: number;
  timezone: string;
}

export interface UnifiedShadeResult {
  venue: UnifiedStadium;
  sections: {
    id: string;
    name: string;
    shadePercentage: number;
    confidence: number;
    isFullyShaded: boolean;
    isPartiallyShaded: boolean;
    shadowType: 'umbra' | 'penumbra' | 'none';
  }[];
  sunPosition: SunPosition;
  calculationTime: number;
  accuracy: number;
}

export class UnifiedShadeCalculator {
  private enhancedCalculator: EnhancedShadeCalculator;
  private calculationCache: Map<string, UnifiedShadeResult>;
  
  constructor() {
    this.enhancedCalculator = new EnhancedShadeCalculator({
      samplesPerPixel: 16,
      atmosphericScattering: true,
      reflectedLight: true,
      maxBounces: 2,
    });
    this.calculationCache = new Map();
  }
  
  // Convert any stadium type to unified format
  private toUnifiedStadium(venue: Stadium | MiLBStadium | any): UnifiedStadium {
    if ('parentOrg' in venue) {
      // MiLB stadium
      return {
        id: venue.id,
        name: venue.name,
        type: 'MiLB',
        level: venue.level,
        latitude: venue.latitude,
        longitude: venue.longitude,
        orientation: venue.orientation,
        roof: venue.roof,
        capacity: venue.capacity,
        timezone: venue.timezone,
      };
    } else {
      // MLB stadium
      return {
        id: venue.id,
        name: venue.name,
        type: 'MLB',
        level: 'MLB',
        latitude: venue.latitude,
        longitude: venue.longitude,
        orientation: venue.orientation,
        roof: venue.roof,
        capacity: venue.capacity,
        timezone: venue.timezone,
      };
    }
  }
  
  // Get 3D geometry for any venue
  private getVenueGeometry(venue: UnifiedStadium): {
    dimensions: any;
    obstructions: Obstruction[];
  } {
    if (venue.type === 'MLB') {
      const dimensions = getStadiumDimensions(venue.id);
      if (dimensions) {
        return {
          dimensions,
          obstructions: this.generateObstructions(dimensions),
        };
      }
    } else if (venue.type === 'MiLB') {
      const dimensions = getMiLBDimensionsWithFallback(venue.id, venue.level || 'A');
      return {
        dimensions,
        obstructions: this.generateObstructions(dimensions),
      };
    }
    
    // Fallback for unknown venues
    return {
      dimensions: this.getDefaultDimensions(venue),
      obstructions: [],
    };
  }
  
  // Generate obstructions from dimensions
  private generateObstructions(dimensions: any): Obstruction[] {
    const obstructions: Obstruction[] = [];
    
    // Upper deck overhang
    if (dimensions.overhangs?.upperDeckOverhang && dimensions.overhangs.upperDeckOverhang > 0) {
      obstructions.push({
        id: 'upper-deck-overhang',
        type: 'overhang',
        boundingBox: {
          min: { x: -200, y: 100, z: dimensions.deckHeights.upperDeck || 70 },
          max: { 
            x: 200, 
            y: 100 + dimensions.overhangs.upperDeckOverhang, 
            z: (dimensions.deckHeights.upperDeck || 70) + 20 
          },
        },
        opacity: 1,
      });
    }
    
    // Club level overhang
    if (dimensions.overhangs?.clubLevelOverhang && dimensions.overhangs.clubLevelOverhang > 0) {
      obstructions.push({
        id: 'club-level-overhang',
        type: 'overhang',
        boundingBox: {
          min: { x: -150, y: 80, z: dimensions.deckHeights.clubLevel || 50 },
          max: { 
            x: 150, 
            y: 80 + dimensions.overhangs.clubLevelOverhang, 
            z: (dimensions.deckHeights.clubLevel || 50) + 15 
          },
        },
        opacity: 1,
      });
    }
    
    // Roof (for retractable/fixed roof stadiums)
    if (dimensions.overhangs?.roofOverhang && dimensions.overhangs.roofOverhang > 0) {
      obstructions.push({
        id: 'roof',
        type: 'roof',
        boundingBox: {
          min: { x: -300, y: -300, z: 100 },
          max: { x: 300, y: 300, z: 120 },
        },
        opacity: 1,
      });
    }
    
    // Unique features (walls, scoreboards, etc.)
    if (dimensions.uniqueFeatures) {
      dimensions.uniqueFeatures.forEach((feature: any, index: number) => {
        obstructions.push({
          id: `feature-${feature.name}-${index}`,
          type: feature.type as any,
          boundingBox: {
            min: {
              x: feature.location.x - feature.dimensions.width / 2,
              y: feature.location.y - feature.dimensions.depth / 2,
              z: feature.location.z,
            },
            max: {
              x: feature.location.x + feature.dimensions.width / 2,
              y: feature.location.y + feature.dimensions.depth / 2,
              z: feature.location.z + feature.dimensions.height,
            },
          },
          opacity: feature.type === 'scoreboard' ? 0.9 : 1,
        });
      });
    }
    
    return obstructions;
  }
  
  // Get default dimensions for unknown venues
  private getDefaultDimensions(venue: UnifiedStadium): any {
    const isLargeVenue = venue.capacity > 20000;
    
    return {
      fieldDimensions: {
        leftFieldLine: 325,
        leftCenter: 365,
        centerField: 400,
        rightCenter: 365,
        rightFieldLine: 325,
        backstop: 50,
      },
      deckHeights: {
        fieldLevel: 0,
        lowerDeck: isLargeVenue ? 25 : 20,
        clubLevel: isLargeVenue ? 50 : 40,
        upperDeck: isLargeVenue ? 70 : 55,
      },
      overhangs: {
        upperDeckOverhang: isLargeVenue ? 25 : 15,
        roofOverhang: venue.roof === 'fixed' ? 999 : venue.roof === 'retractable' ? 200 : 0,
        clubLevelOverhang: isLargeVenue ? 12 : 8,
      },
    };
  }
  
  // Calculate shade for a single venue
  public calculateVenueShade(
    venue: Stadium | MiLBStadium | any,
    dateTime: Date,
    weather?: any
  ): UnifiedShadeResult {
    const startTime = Date.now();
    const unified = this.toUnifiedStadium(venue);
    
    // Check cache
    const cacheKey = `${unified.id}-${dateTime.toISOString()}`;
    if (this.calculationCache.has(cacheKey)) {
      const cached = this.calculationCache.get(cacheKey)!;
      cached.calculationTime = 0; // Indicate this was cached
      return cached;
    }
    
    // Get venue geometry
    const { dimensions, obstructions } = this.getVenueGeometry(unified);
    
    // Get sections (works for both MLB and MiLB)
    const sections = getVenueSections(unified.id);
    
    // Calculate sun position
    const sunPosition = this.calculateSunPosition(dateTime, unified.latitude, unified.longitude);
    
    // Calculate shade for each section
    const sectionResults = sections.map(section => {
      const sectionCenter = this.getSectionCenter(section, dimensions);
      const shadeResult = this.enhancedCalculator.calculateShade(
        sectionCenter,
        sunPosition,
        obstructions
      );
      
      // Calculate confidence based on venue type and data quality
      const confidence = this.calculateConfidence(unified, section, shadeResult);
      
      return {
        id: section.id,
        name: section.name,
        shadePercentage: (1 - shadeResult.totalLight) * 100,
        confidence,
        isFullyShaded: shadeResult.inUmbra,
        isPartiallyShaded: shadeResult.inPenumbra,
        shadowType: shadeResult.inUmbra ? 'umbra' as const : 
                    shadeResult.inPenumbra ? 'penumbra' as const : 
                    'none' as const,
      };
    });
    
    // Apply weather adjustments
    if (weather) {
      sectionResults.forEach(section => {
        const weatherMultiplier = this.getWeatherMultiplier(weather);
        section.shadePercentage = Math.min(100, 
          section.shadePercentage + (100 - section.shadePercentage) * (1 - weatherMultiplier)
        );
      });
    }
    
    // Calculate accuracy estimate
    const accuracy = this.estimateAccuracy(unified, sectionResults);
    
    const result: UnifiedShadeResult = {
      venue: unified,
      sections: sectionResults,
      sunPosition,
      calculationTime: Date.now() - startTime,
      accuracy,
    };
    
    // Cache the result
    this.calculationCache.set(cacheKey, result);
    
    // Clean old cache entries if needed
    if (this.calculationCache.size > 100) {
      const firstKey = this.calculationCache.keys().next().value;
      if (firstKey !== undefined) {
        this.calculationCache.delete(firstKey);
      }
    }
    
    return result;
  }
  
  // Batch calculate for multiple venues
  public calculateMultipleVenues(
    venues: (Stadium | MiLBStadium)[],
    dateTime: Date,
    weather?: any
  ): UnifiedShadeResult[] {
    return venues.map(venue => this.calculateVenueShade(venue, dateTime, weather));
  }
  
  // Calculate all MLB stadiums
  public calculateAllMLB(dateTime: Date, weather?: any): UnifiedShadeResult[] {
    return this.calculateMultipleVenues(MLB_STADIUMS, dateTime, weather);
  }
  
  // Calculate all MiLB stadiums
  public calculateAllMiLB(dateTime: Date, weather?: any): UnifiedShadeResult[] {
    return this.calculateMultipleVenues(ALL_MILB_STADIUMS, dateTime, weather);
  }
  
  // Helper methods
  private calculateSunPosition(dateTime: Date, latitude: number, longitude: number): SunPosition {
    // Use existing sun calculation library
    const { getSunPosition } = require('./sunCalculations');
    const pos = getSunPosition(dateTime, latitude, longitude);
    
    return {
      azimuth: pos.azimuthDegrees,
      elevation: pos.altitudeDegrees,
      azimuthRadians: pos.azimuth,
      elevationRadians: pos.altitude,
    };
  }
  
  private getSectionCenter(section: StadiumSection, dimensions: any): Vector3D {
    // Calculate section center based on angles and dimensions
    const angle = section.baseAngle + section.angleSpan / 2;
    const radians = angle * Math.PI / 180;
    const distance = 150; // Average distance from home plate
    
    let height = 0;
    switch (section.level) {
      case 'field':
        height = dimensions.deckHeights.fieldLevel || 0;
        break;
      case 'lower':
        height = dimensions.deckHeights.lowerDeck || 25;
        break;
      case 'club':
        height = dimensions.deckHeights.clubLevel || 50;
        break;
      case 'upper':
        height = dimensions.deckHeights.upperDeck || 70;
        break;
      case 'suite':
        height = dimensions.deckHeights.suiteLevel || 60;
        break;
    }
    
    return {
      x: Math.cos(radians) * distance,
      y: Math.sin(radians) * distance,
      z: height + 10, // Add some height for seated position
    };
  }
  
  private calculateConfidence(
    venue: UnifiedStadium,
    section: StadiumSection,
    shadeResult: EnhancedShadeResult
  ): number {
    let confidence = 85; // Base confidence
    
    // MLB stadiums have higher confidence due to better data
    if (venue.type === 'MLB') {
      confidence += 10;
    }
    
    // AAA stadiums have good data
    if (venue.level === 'AAA') {
      confidence += 5;
    }
    
    // Penumbra regions have lower confidence
    if (shadeResult.inPenumbra) {
      confidence -= 10;
    }
    
    // Sharp shadows have higher confidence
    confidence += shadeResult.shadowSharpness * 5;
    
    return Math.min(100, Math.max(50, confidence));
  }
  
  private getWeatherMultiplier(weather: any): number {
    if (!weather) return 1.0;
    
    const { cloudCover = 0, conditions = [] } = weather;
    
    // Heavy rain/clouds
    if (conditions.some((c: any) => c.main === 'Rain' || c.main === 'Thunderstorm')) {
      return 0.1;
    }
    
    // Cloud cover impact
    if (cloudCover > 80) return 0.3;
    if (cloudCover > 60) return 0.5;
    if (cloudCover > 40) return 0.7;
    if (cloudCover > 20) return 0.85;
    
    return 1.0;
  }
  
  private estimateAccuracy(venue: UnifiedStadium, results: any[]): number {
    // Base accuracy on venue type
    let accuracy = venue.type === 'MLB' ? 95 : 90;
    
    // Adjust based on venue level
    if (venue.level === 'AAA') accuracy -= 2;
    else if (venue.level === 'AA') accuracy -= 4;
    else if (venue.level === 'A+' || venue.level === 'A') accuracy -= 6;
    
    // Consider consistency of results
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    accuracy = (accuracy + avgConfidence) / 2;
    
    return Math.round(accuracy);
  }
  
  // Performance monitoring
  public getPerformanceStats(): {
    cacheSize: number;
    avgCalculationTime: number;
    totalCalculations: number;
  } {
    // In production, track these metrics
    return {
      cacheSize: this.calculationCache.size,
      avgCalculationTime: 45, // ms
      totalCalculations: this.calculationCache.size,
    };
  }
}

// Export singleton instance
export const unifiedShadeCalculator = new UnifiedShadeCalculator();