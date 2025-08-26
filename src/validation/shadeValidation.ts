// Shade Calculation Validation Framework
// Compares calculated shade patterns with real stadium photos

import { Stadium } from '../data/stadiums';
import { getShadedSections } from '../utils/getShadedSections';
import { EnhancedShadeCalculator } from '../utils/shadeCalculation3DEnhanced';
import { getStadiumDimensions } from '../data/stadiumGeometryDetailed';

export interface ValidationPhoto {
  stadiumId: string;
  dateTime: Date;
  weather: {
    cloudCover: number;
    temperature: number;
  };
  photoUrl: string;
  groundTruth: {
    sectionId: string;
    actualShadePercentage: number;
  }[];
}

export interface ValidationResult {
  photoId: string;
  stadiumId: string;
  dateTime: Date;
  sections: {
    sectionId: string;
    calculated: number;
    actual: number;
    error: number;
  }[];
  averageError: number;
  maxError: number;
  confidenceScore: number;
}

export interface ValidationMetrics {
  totalPhotos: number;
  totalSections: number;
  averageError: number;
  standardDeviation: number;
  percentileErrors: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  accuracyByTimeOfDay: Map<string, number>;
  accuracyByStadium: Map<string, number>;
}

export class ShadeValidationSystem {
  private calculator: EnhancedShadeCalculator;
  private validationData: ValidationPhoto[] = [];
  private results: ValidationResult[] = [];
  
  constructor() {
    this.calculator = new EnhancedShadeCalculator({
      samplesPerPixel: 32, // High quality for validation
      atmosphericScattering: true,
      reflectedLight: true,
    });
    
    // Load validation dataset
    this.loadValidationData();
  }
  
  // Load ground truth data from real photos
  private loadValidationData() {
    // In production, this would load from a database or API
    // For now, we'll use sample data
    this.validationData = [
      {
        stadiumId: 'yankees',
        dateTime: new Date('2024-07-15T13:00:00-04:00'),
        weather: { cloudCover: 20, temperature: 85 },
        photoUrl: '/validation/yankees-july15-1pm.jpg',
        groundTruth: [
          { sectionId: '420', actualShadePercentage: 100 },
          { sectionId: '421', actualShadePercentage: 85 },
          { sectionId: '320', actualShadePercentage: 60 },
          { sectionId: '115', actualShadePercentage: 0 },
          { sectionId: '203', actualShadePercentage: 30 },
        ],
      },
      {
        stadiumId: 'dodgers',
        dateTime: new Date('2024-06-20T19:00:00-07:00'),
        weather: { cloudCover: 0, temperature: 72 },
        photoUrl: '/validation/dodgers-june20-7pm.jpg',
        groundTruth: [
          { sectionId: '1RS', actualShadePercentage: 95 },
          { sectionId: '2RS', actualShadePercentage: 90 },
          { sectionId: '50FD', actualShadePercentage: 15 },
          { sectionId: '157LG', actualShadePercentage: 40 },
        ],
      },
      {
        stadiumId: 'redsox',
        dateTime: new Date('2024-08-10T14:00:00-04:00'),
        weather: { cloudCover: 50, temperature: 78 },
        photoUrl: '/validation/redsox-aug10-2pm.jpg',
        groundTruth: [
          { sectionId: 'GS32', actualShadePercentage: 0 }, // Green Monster seats
          { sectionId: 'P26', actualShadePercentage: 75 },
          { sectionId: 'B10', actualShadePercentage: 100 },
          { sectionId: 'RF3', actualShadePercentage: 20 },
        ],
      },
    ];
  }
  
  // Validate a single photo
  private validatePhoto(photo: ValidationPhoto): ValidationResult {
    const stadium = this.getStadium(photo.stadiumId);
    if (!stadium) {
      throw new Error(`Stadium ${photo.stadiumId} not found`);
    }
    
    // Calculate shade for the photo's conditions
    const calculatedShade = getShadedSections(
      stadium,
      photo.dateTime,
      {
        cloudCover: photo.weather.cloudCover,
        temperature: photo.weather.temperature,
        conditions: [],
        humidity: 50,
        windSpeed: 5,
        windDirection: 0,
        visibility: 10,
      }
    );
    
    // Compare with ground truth
    const sections = photo.groundTruth.map(truth => {
      const calculated = calculatedShade.find(s => s.section.id === truth.sectionId);
      const calculatedPercentage = calculated ? calculated.shadePercentage : 0;
      const error = Math.abs(calculatedPercentage - truth.actualShadePercentage);
      
      return {
        sectionId: truth.sectionId,
        calculated: calculatedPercentage,
        actual: truth.actualShadePercentage,
        error,
      };
    });
    
    // Calculate metrics
    const errors = sections.map(s => s.error);
    const averageError = errors.reduce((a, b) => a + b, 0) / errors.length;
    const maxError = Math.max(...errors);
    
    // Calculate confidence score (0-100)
    const confidenceScore = Math.max(0, 100 - averageError);
    
    return {
      photoId: photo.photoUrl,
      stadiumId: photo.stadiumId,
      dateTime: photo.dateTime,
      sections,
      averageError,
      maxError,
      confidenceScore,
    };
  }
  
  // Run validation on all photos
  public runValidation(): ValidationMetrics {
    this.results = this.validationData.map(photo => this.validatePhoto(photo));
    
    // Calculate overall metrics
    const allErrors: number[] = [];
    const errorsByTime = new Map<string, number[]>();
    const errorsByStadium = new Map<string, number[]>();
    
    for (const result of this.results) {
      const hour = result.dateTime.getHours();
      const timeSlot = `${hour}:00`;
      
      for (const section of result.sections) {
        allErrors.push(section.error);
        
        // Group by time
        if (!errorsByTime.has(timeSlot)) {
          errorsByTime.set(timeSlot, []);
        }
        errorsByTime.get(timeSlot)!.push(section.error);
        
        // Group by stadium
        if (!errorsByStadium.has(result.stadiumId)) {
          errorsByStadium.set(result.stadiumId, []);
        }
        errorsByStadium.get(result.stadiumId)!.push(section.error);
      }
    }
    
    // Calculate statistics
    const averageError = this.mean(allErrors);
    const standardDeviation = this.standardDeviation(allErrors);
    const sortedErrors = [...allErrors].sort((a, b) => a - b);
    
    // Calculate accuracy by time of day
    const accuracyByTimeOfDay = new Map<string, number>();
    for (const [time, errors] of errorsByTime) {
      accuracyByTimeOfDay.set(time, 100 - this.mean(errors));
    }
    
    // Calculate accuracy by stadium
    const accuracyByStadium = new Map<string, number>();
    for (const [stadium, errors] of errorsByStadium) {
      accuracyByStadium.set(stadium, 100 - this.mean(errors));
    }
    
    return {
      totalPhotos: this.validationData.length,
      totalSections: allErrors.length,
      averageError,
      standardDeviation,
      percentileErrors: {
        p50: this.percentile(sortedErrors, 50),
        p90: this.percentile(sortedErrors, 90),
        p95: this.percentile(sortedErrors, 95),
        p99: this.percentile(sortedErrors, 99),
      },
      accuracyByTimeOfDay,
      accuracyByStadium,
    };
  }
  
  // Generate validation report
  public generateReport(): string {
    const metrics = this.runValidation();
    
    let report = '# Shade Calculation Validation Report\n\n';
    report += `## Summary\n`;
    report += `- Total Photos Analyzed: ${metrics.totalPhotos}\n`;
    report += `- Total Sections Validated: ${metrics.totalSections}\n`;
    report += `- Average Error: ${metrics.averageError.toFixed(2)}%\n`;
    report += `- Standard Deviation: ${metrics.standardDeviation.toFixed(2)}%\n`;
    report += `- Overall Accuracy: ${(100 - metrics.averageError).toFixed(2)}%\n\n`;
    
    report += `## Error Distribution\n`;
    report += `- 50th percentile: ${metrics.percentileErrors.p50.toFixed(2)}%\n`;
    report += `- 90th percentile: ${metrics.percentileErrors.p90.toFixed(2)}%\n`;
    report += `- 95th percentile: ${metrics.percentileErrors.p95.toFixed(2)}%\n`;
    report += `- 99th percentile: ${metrics.percentileErrors.p99.toFixed(2)}%\n\n`;
    
    report += `## Accuracy by Time of Day\n`;
    for (const [time, accuracy] of metrics.accuracyByTimeOfDay) {
      report += `- ${time}: ${accuracy.toFixed(2)}%\n`;
    }
    report += '\n';
    
    report += `## Accuracy by Stadium\n`;
    for (const [stadium, accuracy] of metrics.accuracyByStadium) {
      report += `- ${stadium}: ${accuracy.toFixed(2)}%\n`;
    }
    report += '\n';
    
    report += `## Detailed Results\n`;
    for (const result of this.results) {
      report += `\n### ${result.stadiumId} - ${result.dateTime.toLocaleString()}\n`;
      report += `- Average Error: ${result.averageError.toFixed(2)}%\n`;
      report += `- Max Error: ${result.maxError.toFixed(2)}%\n`;
      report += `- Confidence Score: ${result.confidenceScore.toFixed(0)}%\n`;
      report += `- Sections:\n`;
      for (const section of result.sections) {
        const status = section.error < 10 ? '✅' : section.error < 20 ? '⚠️' : '❌';
        report += `  ${status} ${section.sectionId}: Calculated ${section.calculated.toFixed(0)}%, Actual ${section.actual.toFixed(0)}% (Error: ${section.error.toFixed(0)}%)\n`;
      }
    }
    
    return report;
  }
  
  // Statistical utilities
  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  private standardDeviation(values: number[]): number {
    const avg = this.mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }
  
  private percentile(sortedValues: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (lower === upper) {
      return sortedValues[lower];
    }
    
    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }
  
  private getStadium(stadiumId: string): Stadium | null {
    // Import dynamically to avoid circular dependency
    const { MLB_STADIUMS } = require('../data/stadiums');
    return MLB_STADIUMS.find((s: Stadium) => s.id === stadiumId) || null;
  }
  
  // Visual debugging - generate comparison images
  public generateComparisonVisualization(
    photoId: string,
    outputPath: string
  ): void {
    // In a real implementation, this would:
    // 1. Load the original photo
    // 2. Overlay calculated shade patterns
    // 3. Highlight differences
    // 4. Save comparison image
    
    console.log(`Generating comparison for ${photoId} to ${outputPath}`);
  }
  
  // Confidence scoring for real-time predictions
  public getConfidenceScore(
    stadiumId: string,
    dateTime: Date,
    sectionId: string
  ): number {
    // Base confidence on validation results
    const stadiumAccuracy = this.results
      .filter(r => r.stadiumId === stadiumId)
      .map(r => r.confidenceScore);
    
    if (stadiumAccuracy.length === 0) {
      return 75; // Default confidence if no validation data
    }
    
    // Adjust based on time of day
    const hour = dateTime.getHours();
    const timeAdjustment = hour >= 11 && hour <= 15 ? 1.0 : 0.9; // Higher confidence at midday
    
    // Calculate final confidence
    const baseConfidence = this.mean(stadiumAccuracy);
    return Math.min(100, baseConfidence * timeAdjustment);
  }
}

// Export singleton instance
export const validationSystem = new ShadeValidationSystem();