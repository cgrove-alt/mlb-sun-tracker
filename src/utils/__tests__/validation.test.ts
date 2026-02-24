/**
 * Comprehensive Test Suite for Data Validation Utilities
 * Tests stadium data, coordinate, and input validation
 */

import {
  validateStadiumData,
  validateSection,
  validateCoordinates,
  validateObstruction,
  validateRowRange,
  validateGameTime,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateStadiumData', () => {
    it('should validate correct stadium data', () => {
      const validData = {
        id: 'yankees',
        name: 'Yankee Stadium',
        location: { latitude: 40.8296, longitude: -73.9262 },
        sections: [],
        obstructions: [],
      };

      const result = validateStadiumData(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject stadium without id', () => {
      const invalidData = {
        name: 'Test Stadium',
        location: { latitude: 40.8296, longitude: -73.9262 },
        sections: [],
        obstructions: [],
      };

      const result = validateStadiumData(invalidData as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stadium ID is required');
    });

    it('should reject stadium without name', () => {
      const invalidData = {
        id: 'test',
        location: { latitude: 40.8296, longitude: -73.9262 },
        sections: [],
        obstructions: [],
      };

      const result = validateStadiumData(invalidData as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stadium name is required');
    });

    it('should reject stadium without location', () => {
      const invalidData = {
        id: 'test',
        name: 'Test Stadium',
        sections: [],
        obstructions: [],
      };

      const result = validateStadiumData(invalidData as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('location'))).toBe(true);
    });
  });

  describe('validateSection', () => {
    it('should validate correct section', () => {
      const validSection = {
        id: 'section-101',
        name: 'Section 101',
        sectionGroup: 'Lower Level',
        coordinates: { x: 100, y: 50, z: 10 },
        elevation: 15,
        rowRange: { min: 1, max: 20 },
        seatsPerRow: 20,
        vertices: [
          { x: 90, y: 40, z: 10 },
          { x: 110, y: 40, z: 10 },
          { x: 110, y: 60, z: 10 },
          { x: 90, y: 60, z: 10 },
        ],
      };

      const result = validateSection(validSection);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject section without id', () => {
      const invalidSection = {
        name: 'Section 101',
        sectionGroup: 'Lower Level',
        coordinates: { x: 100, y: 50, z: 10 },
        elevation: 15,
      };

      const result = validateSection(invalidSection as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Section ID is required');
    });

    it('should reject section with invalid coordinates', () => {
      const invalidSection = {
        id: 'section-101',
        name: 'Section 101',
        coordinates: { x: 'invalid', y: 50, z: 10 },
      };

      const result = validateSection(invalidSection as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('coordinates'))).toBe(true);
    });

    it('should reject section with fewer than 3 vertices', () => {
      const invalidSection = {
        id: 'section-101',
        name: 'Section 101',
        coordinates: { x: 100, y: 50, z: 10 },
        vertices: [
          { x: 90, y: 40, z: 10 },
          { x: 110, y: 40, z: 10 },
        ],
      };

      const result = validateSection(invalidSection as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('vertices'))).toBe(true);
    });

    it('should reject section with invalid row range', () => {
      const invalidSection = {
        id: 'section-101',
        name: 'Section 101',
        coordinates: { x: 100, y: 50, z: 10 },
        rowRange: { min: 20, max: 10 }, // Invalid: min > max
      };

      const result = validateSection(invalidSection as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('row range'))).toBe(true);
    });

    it('should reject section with negative elevation', () => {
      const invalidSection = {
        id: 'section-101',
        name: 'Section 101',
        coordinates: { x: 100, y: 50, z: 10 },
        elevation: -5, // Invalid
      };

      const result = validateSection(invalidSection as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('elevation'))).toBe(true);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate correct 3D coordinates', () => {
      const validCoords = { x: 100, y: 50, z: 10 };

      const result = validateCoordinates(validCoords);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject coordinates with missing x', () => {
      const invalidCoords = { y: 50, z: 10 };

      const result = validateCoordinates(invalidCoords as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('x coordinate is required');
    });

    it('should reject coordinates with missing y', () => {
      const invalidCoords = { x: 100, z: 10 };

      const result = validateCoordinates(invalidCoords as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('y coordinate is required');
    });

    it('should reject coordinates with missing z', () => {
      const invalidCoords = { x: 100, y: 50 };

      const result = validateCoordinates(invalidCoords as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('z coordinate is required');
    });

    it('should reject coordinates with non-numeric values', () => {
      const invalidCoords = { x: 'invalid', y: 50, z: 10 };

      const result = validateCoordinates(invalidCoords as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('numeric'))).toBe(true);
    });

    it('should reject coordinates with NaN values', () => {
      const invalidCoords = { x: NaN, y: 50, z: 10 };

      const result = validateCoordinates(invalidCoords);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('numeric'))).toBe(true);
    });

    it('should reject coordinates with Infinity', () => {
      const invalidCoords = { x: Infinity, y: 50, z: 10 };

      const result = validateCoordinates(invalidCoords);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('numeric'))).toBe(true);
    });
  });

  describe('validateObstruction', () => {
    it('should validate correct obstruction', () => {
      const validObstruction = {
        id: 'roof-1',
        name: 'Upper Deck Overhang',
        type: 'roof',
        vertices: [
          { x: 80, y: 30, z: 50 },
          { x: 120, y: 30, z: 50 },
          { x: 120, y: 70, z: 50 },
          { x: 80, y: 70, z: 50 },
        ],
        castsShadow: true,
      };

      const result = validateObstruction(validObstruction);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject obstruction without id', () => {
      const invalidObstruction = {
        name: 'Test Obstruction',
        type: 'roof',
        vertices: [
          { x: 80, y: 30, z: 50 },
          { x: 120, y: 30, z: 50 },
          { x: 120, y: 70, z: 50 },
        ],
      };

      const result = validateObstruction(invalidObstruction as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Obstruction ID is required');
    });

    it('should reject obstruction without vertices', () => {
      const invalidObstruction = {
        id: 'roof-1',
        name: 'Test Obstruction',
        type: 'roof',
      };

      const result = validateObstruction(invalidObstruction as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('vertices'))).toBe(true);
    });

    it('should reject obstruction with fewer than 3 vertices', () => {
      const invalidObstruction = {
        id: 'roof-1',
        name: 'Test Obstruction',
        type: 'roof',
        vertices: [
          { x: 80, y: 30, z: 50 },
          { x: 120, y: 30, z: 50 },
        ],
      };

      const result = validateObstruction(invalidObstruction);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('vertices'))).toBe(true);
    });

    it('should accept valid obstruction types', () => {
      const types = ['roof', 'scoreboard', 'light-tower', 'other'];

      types.forEach((type) => {
        const obstruction = {
          id: 'test',
          name: 'Test',
          type,
          vertices: [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 },
          ],
        };

        const result = validateObstruction(obstruction);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('validateRowRange', () => {
    it('should validate correct row range', () => {
      const validRange = { min: 1, max: 20 };

      const result = validateRowRange(validRange);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject row range where min > max', () => {
      const invalidRange = { min: 20, max: 10 };

      const result = validateRowRange(invalidRange);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('min'))).toBe(true);
    });

    it('should reject row range with negative values', () => {
      const invalidRange = { min: -5, max: 10 };

      const result = validateRowRange(invalidRange);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('positive'))).toBe(true);
    });

    it('should reject row range with zero values', () => {
      const invalidRange = { min: 0, max: 10 };

      const result = validateRowRange(invalidRange);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('positive'))).toBe(true);
    });

    it('should accept row range where min equals max', () => {
      const validRange = { min: 10, max: 10 };

      const result = validateRowRange(validRange);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateGameTime', () => {
    it('should validate correct game time', () => {
      const validTime = new Date('2025-06-21T19:05:00Z');

      const result = validateGameTime(validTime);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid date object', () => {
      const invalidTime = new Date('invalid');

      const result = validateGameTime(invalidTime);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid date'))).toBe(true);
    });

    it('should reject non-date values', () => {
      const invalidTime = '2025-06-21T19:05:00Z';

      const result = validateGameTime(invalidTime as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Date object'))).toBe(true);
    });

    it('should reject dates too far in the past', () => {
      const oldDate = new Date('2000-01-01T12:00:00Z');

      const result = validateGameTime(oldDate);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('past'))).toBe(true);
    });

    it('should reject dates too far in the future', () => {
      const futureDate = new Date('2030-01-01T12:00:00Z');

      const result = validateGameTime(futureDate);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('future'))).toBe(true);
    });

    it('should accept current date', () => {
      const now = new Date();

      const result = validateGameTime(now);

      expect(result.isValid).toBe(true);
    });

    it('should accept dates within valid range', () => {
      const validFutureDate = new Date();
      validFutureDate.setFullYear(validFutureDate.getFullYear() + 1);

      const result = validateGameTime(validFutureDate);

      expect(result.isValid).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle null values gracefully', () => {
      const result = validateStadiumData(null as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle undefined values gracefully', () => {
      const result = validateStadiumData(undefined as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle empty objects', () => {
      const result = validateStadiumData({} as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should accumulate multiple errors', () => {
      const invalidData = {
        // Missing id, name, location
        sections: 'not-an-array',
        obstructions: 123,
      };

      const result = validateStadiumData(invalidData as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3); // Multiple errors
    });
  });
});
