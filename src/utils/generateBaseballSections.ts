import { UnifiedVenue } from '../data/unifiedVenues';

export interface BaseballSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number;
  angleSpan: number;
  rows?: number;
  covered: boolean;
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
}

/**
 * Generates standard baseball stadium sections for MiLB stadiums
 * Based on typical MiLB stadium layouts with fewer levels than MLB
 */
export function generateBaseballSections(venue: UnifiedVenue): BaseballSection[] {
  const sections: BaseballSection[] = [];
  
  // Most MiLB stadiums have simpler layouts than MLB stadiums
  // Typical layout: Field boxes, baseline boxes, reserved seating, general admission
  
  // Field Level - Behind home plate (premium seats)
  for (let i = 0; i < 5; i++) {
    sections.push({
      id: `field-${i + 1}`,
      name: `Field Box ${i + 1}`,
      level: 'field',
      baseAngle: 340 + (i * 8), // 340 to 372 (wraps to 12)
      angleSpan: 8,
      covered: venue.roofHeight ? true : false,
      price: 'premium'
    });
  }
  
  // Lower Level - First base side
  for (let i = 0; i < 8; i++) {
    sections.push({
      id: `lower-1b-${i + 1}`,
      name: `Box ${100 + i}`,
      level: 'lower',
      baseAngle: 20 + (i * 10), // 20 to 90 degrees
      angleSpan: 10,
      covered: false,
      price: 'moderate'
    });
  }
  
  // Lower Level - Third base side
  for (let i = 0; i < 8; i++) {
    sections.push({
      id: `lower-3b-${i + 1}`,
      name: `Box ${200 + i}`,
      level: 'lower',
      baseAngle: 270 + (i * 10), // 270 to 340 degrees
      angleSpan: 10,
      covered: false,
      price: 'moderate'
    });
  }
  
  // Reserved Seating - Behind first base boxes
  for (let i = 0; i < 6; i++) {
    sections.push({
      id: `reserved-1b-${i + 1}`,
      name: `Reserved ${300 + i}`,
      level: 'lower',
      baseAngle: 100 + (i * 10), // 100 to 150 degrees
      angleSpan: 10,
      covered: false,
      price: 'value'
    });
  }
  
  // Reserved Seating - Behind third base boxes
  for (let i = 0; i < 6; i++) {
    sections.push({
      id: `reserved-3b-${i + 1}`,
      name: `Reserved ${400 + i}`,
      level: 'lower',
      baseAngle: 210 + (i * 10), // 210 to 260 degrees
      angleSpan: 10,
      covered: false,
      price: 'value'
    });
  }
  
  // General Admission / Bleachers - Outfield
  sections.push({
    id: 'ga-left',
    name: 'Left Field GA',
    level: 'lower',
    baseAngle: 150,
    angleSpan: 30,
    covered: false,
    price: 'value'
  });
  
  sections.push({
    id: 'ga-center',
    name: 'Berm/GA',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 30,
    covered: false,
    price: 'value'
  });
  
  sections.push({
    id: 'ga-right',
    name: 'Right Field GA',
    level: 'lower',
    baseAngle: 210,
    angleSpan: 30,
    covered: false,
    price: 'value'
  });
  
  // If the stadium has an upper deck (rare in MiLB but some AAA stadiums have it)
  if (venue.upperDeckHeight && venue.capacity && venue.capacity > 10000) {
    // Upper deck behind home plate
    for (let i = 0; i < 5; i++) {
      sections.push({
        id: `upper-${i + 1}`,
        name: `Upper ${500 + i}`,
        level: 'upper',
        baseAngle: 340 + (i * 8),
        angleSpan: 8,
        covered: true,
        price: 'value'
      });
    }
    
    // Upper deck first base side
    for (let i = 0; i < 4; i++) {
      sections.push({
        id: `upper-1b-${i + 1}`,
        name: `Upper ${510 + i}`,
        level: 'upper',
        baseAngle: 20 + (i * 15),
        angleSpan: 15,
        covered: venue.roofOverhang ? true : false,
        price: 'value'
      });
    }
    
    // Upper deck third base side
    for (let i = 0; i < 4; i++) {
      sections.push({
        id: `upper-3b-${i + 1}`,
        name: `Upper ${520 + i}`,
        level: 'upper',
        baseAngle: 300 + (i * 10),
        angleSpan: 10,
        covered: venue.roofOverhang ? true : false,
        price: 'value'
      });
    }
  }
  
  // Add suites if it's a newer/larger stadium
  if (venue.capacity && venue.capacity > 8000) {
    for (let i = 0; i < 8; i++) {
      sections.push({
        id: `suite-${i + 1}`,
        name: `Suite ${i + 1}`,
        level: 'suite',
        baseAngle: 340 + (i * 10),
        angleSpan: 10,
        covered: true,
        price: 'luxury'
      });
    }
  }
  
  return sections;
}