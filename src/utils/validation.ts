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