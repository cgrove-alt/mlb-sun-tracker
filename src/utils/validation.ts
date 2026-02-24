/**
 * Input validation and sanitization utilities
 * Used by both mobile and desktop versions
 */

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove any HTML tags
  const cleaned = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  return cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate stadium ID
export function validateStadiumId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  
  // Stadium IDs should only contain lowercase letters and hyphens
  return /^[a-z-]+$/.test(id);
}

// Validate date input
export function validateDate(date: string): boolean {
  if (!date || typeof date !== 'string') return false;
  
  // Check format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  
  const parsed = new Date(date);
  return parsed instanceof Date && !isNaN(parsed.getTime());
}

// Validate time input
export function validateTime(time: string): boolean {
  if (!time || typeof time !== 'string') return false;
  
  // Check format HH:MM or HH:MM:SS
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(time);
}

// Validate numeric range
export function validateNumericRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && 
         !isNaN(value) && 
         value >= min && 
         value <= max;
}

// Validate filter criteria
export function validateFilterCriteria(criteria: any): boolean {
  if (!criteria || typeof criteria !== 'object') return false;
  
  // Validate sun preference
  if (criteria.sunPreference && 
      !['all', 'shade', 'sun'].includes(criteria.sunPreference)) {
    return false;
  }
  
  // Validate max sun exposure
  if (criteria.maxSunExposure !== undefined && 
      !validateNumericRange(criteria.maxSunExposure, 0, 100)) {
    return false;
  }
  
  // Validate price tier
  if (criteria.priceTier && 
      !['all', 'luxury', 'premium', 'moderate', 'value'].includes(criteria.priceTier)) {
    return false;
  }
  
  return true;
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }
    
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.attempts.entries());
    for (const [key, attempts] of entries) {
      const validAttempts = attempts.filter((time: number) => now - time < this.windowMs);
      if (validAttempts.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, validAttempts);
      }
    }
  }
}

// API request sanitization
export function sanitizeApiUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Only allow specific protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }

    // Only allow specific hosts
    const allowedHosts = [
      'api.open-meteo.com',
      'statsapi.mlb.com',
      'localhost',
      '127.0.0.1'
    ];

    if (!allowedHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))) {
      throw new Error('Invalid host');
    }

    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
}

// Advanced validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}

// Validate 3D coordinates
export function validateCoordinates(coords: any): ValidationResult {
  const errors: string[] = [];

  if (!coords || typeof coords !== 'object') {
    errors.push('Coordinates must be an object');
    return { isValid: false, errors };
  }

  // Check for missing coordinates
  if (coords.x === undefined) {
    errors.push('x coordinate is required');
  } else if (typeof coords.x !== 'number' || isNaN(coords.x) || !isFinite(coords.x)) {
    errors.push('x coordinate must be a valid numeric value');
  }

  if (coords.y === undefined) {
    errors.push('y coordinate is required');
  } else if (typeof coords.y !== 'number' || isNaN(coords.y) || !isFinite(coords.y)) {
    errors.push('y coordinate must be a valid numeric value');
  }

  if (coords.z === undefined) {
    errors.push('z coordinate is required');
  } else if (typeof coords.z !== 'number' || isNaN(coords.z) || !isFinite(coords.z)) {
    errors.push('z coordinate must be a valid numeric value');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate row range
export function validateRowRange(range: any): ValidationResult {
  const errors: string[] = [];

  if (!range || typeof range !== 'object') {
    errors.push('Row range must be an object');
    return { isValid: false, errors };
  }

  if (typeof range.min !== 'number' || range.min <= 0) {
    errors.push('Row range min must be a positive number');
  }

  if (typeof range.max !== 'number' || range.max <= 0) {
    errors.push('Row range max must be a positive number');
  }

  if (typeof range.min === 'number' && typeof range.max === 'number' && range.min > range.max) {
    errors.push('Row range min cannot be greater than max');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate game time
export function validateGameTime(date: any): ValidationResult {
  const errors: string[] = [];

  if (!(date instanceof Date)) {
    errors.push('Game time must be a valid Date object');
    return { isValid: false, errors };
  }

  if (isNaN(date.getTime())) {
    errors.push('Invalid date provided');
    return { isValid: false, errors };
  }

  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const twoYearsFromNow = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());

  if (date < oneYearAgo) {
    errors.push('Game time cannot be more than 1 year in the past');
  }

  if (date > twoYearsFromNow) {
    errors.push('Game time cannot be more than 2 years in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate section
export function validateSection(section: any): ValidationResult {
  const errors: string[] = [];

  if (!section || typeof section !== 'object') {
    errors.push('Section must be an object');
    return { isValid: false, errors };
  }

  if (!section.id || typeof section.id !== 'string') {
    errors.push('Section ID is required');
  }

  if (!section.name || typeof section.name !== 'string') {
    errors.push('Section name is required');
  }

  // Validate single coordinates (center point)
  if (section.coordinates) {
    const coordResult = validateCoordinates(section.coordinates);
    if (!coordResult.isValid) {
      errors.push(`Invalid section coordinates: ${coordResult.errors.join(', ')}`);
    }
  }

  // Validate vertices array (3D boundary points)
  if (section.vertices) {
    if (!Array.isArray(section.vertices)) {
      errors.push('Section vertices must be an array');
    } else if (section.vertices.length < 3) {
      errors.push('Section must have at least 3 vertices');
    } else {
      section.vertices.forEach((vertex: any, index: number) => {
        const vertexResult = validateCoordinates(vertex);
        if (!vertexResult.isValid) {
          errors.push(`Invalid vertex at index ${index}: ${vertexResult.errors.join(', ')}`);
        }
      });
    }
  }

  // Validate row range
  if (section.rowRange) {
    const rangeResult = validateRowRange(section.rowRange);
    if (!rangeResult.isValid) {
      errors.push(...rangeResult.errors.map(e => `Invalid row range: ${e}`));
    }
  }

  if (section.elevation !== undefined && (typeof section.elevation !== 'number' || section.elevation < 0)) {
    errors.push('Section elevation must be a non-negative number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate obstruction
export function validateObstruction(obstruction: any): ValidationResult {
  const errors: string[] = [];

  if (!obstruction || typeof obstruction !== 'object') {
    errors.push('Obstruction must be an object');
    return { isValid: false, errors };
  }

  if (!obstruction.id || typeof obstruction.id !== 'string') {
    errors.push('Obstruction ID is required');
  }

  if (!obstruction.name || typeof obstruction.name !== 'string') {
    errors.push('Obstruction name is required');
  }

  const validTypes = ['roof', 'overhang', 'scoreboard', 'light-tower', 'wall', 'other'];
  if (obstruction.type && !validTypes.includes(obstruction.type)) {
    errors.push(`Obstruction type must be one of: ${validTypes.join(', ')}`);
  }

  if (!obstruction.vertices || !Array.isArray(obstruction.vertices)) {
    errors.push('Obstruction must have vertices array');
  } else if (obstruction.vertices.length < 3) {
    errors.push('Obstruction must have at least 3 vertices');
  } else {
    obstruction.vertices.forEach((vertex: any, index: number) => {
      const coordResult = validateCoordinates(vertex);
      if (!coordResult.isValid) {
        errors.push(`Invalid vertex at index ${index}: ${coordResult.errors.join(', ')}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate stadium data
export function validateStadiumData(stadium: any): ValidationResult {
  const errors: string[] = [];

  if (!stadium || typeof stadium !== 'object') {
    errors.push('Stadium must be an object');
    return { isValid: false, errors };
  }

  if (!stadium.id || typeof stadium.id !== 'string') {
    errors.push('Stadium ID is required');
  }

  if (!stadium.name || typeof stadium.name !== 'string') {
    errors.push('Stadium name is required');
  }

  if (!stadium.location || typeof stadium.location !== 'object') {
    errors.push('Stadium location is required');
  } else {
    if (typeof stadium.location.latitude !== 'number' ||
        stadium.location.latitude < -90 ||
        stadium.location.latitude > 90) {
      errors.push('Stadium location latitude must be between -90 and 90');
    }

    if (typeof stadium.location.longitude !== 'number' ||
        stadium.location.longitude < -180 ||
        stadium.location.longitude > 180) {
      errors.push('Stadium location longitude must be between -180 and 180');
    }
  }

  if (stadium.sections !== undefined) {
    if (!Array.isArray(stadium.sections)) {
      errors.push('Sections must be an array');
    } else {
      stadium.sections.forEach((section: any, index: number) => {
        const sectionResult = validateSection(section);
        if (!sectionResult.isValid) {
          errors.push(`Section ${index}: ${sectionResult.errors.join(', ')}`);
        }
      });
    }
  }

  if (stadium.obstructions !== undefined) {
    if (!Array.isArray(stadium.obstructions)) {
      errors.push('Obstructions must be an array');
    } else {
      stadium.obstructions.forEach((obstruction: any, index: number) => {
        const obstructionResult = validateObstruction(obstruction);
        if (!obstructionResult.isValid) {
          errors.push(`Obstruction ${index}: ${obstructionResult.errors.join(', ')}`);
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}