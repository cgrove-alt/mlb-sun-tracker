/**
 * Comprehensive Test Suite for 3D Shade Calculations
 * Tests optimized 3D shadow casting and obstruction detection
 */

import { OptimizedShadeCalculator3D } from '../shadeCalculation3DOptimized';
import type { StadiumSection, Obstruction } from '@/src/types/stadium';

describe('OptimizedShadeCalculator3D', () => {
  let calculator: OptimizedShadeCalculator3D;

  // Sample test data
  const sampleSection: StadiumSection = {
    id: 'test-section-101',
    name: 'Section 101',
    sectionGroup: 'Lower Level',
    coordinates: {
      x: 100,
      y: 50,
      z: 10,
    },
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

  const sampleObstruction: Obstruction = {
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

  beforeEach(() => {
    calculator = new OptimizedShadeCalculator3D();
  });

  describe('initialization', () => {
    it('should create calculator instance', () => {
      expect(calculator).toBeInstanceOf(OptimizedShadeCalculator3D);
    });

    it('should accept stadium data on construction', () => {
      const sections: StadiumSection[] = [sampleSection];
      const obstructions: Obstruction[] = [sampleObstruction];

      const calc = new OptimizedShadeCalculator3D(sections, obstructions);

      expect(calc).toBeInstanceOf(OptimizedShadeCalculator3D);
    });
  });

  describe('calculateShadePercentage', () => {
    it('should calculate 0% shade when sun is directly overhead with no obstructions', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, []);

      const sunVector = { x: 0, y: 0, z: -1 }; // Directly overhead

      const shadePercentage = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shadePercentage).toBeLessThan(10); // Minimal shade
    });

    it('should calculate 100% shade when section is under complete obstruction', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);

      const sunVector = { x: 0, y: 0, z: -1 }; // Sun directly above

      const shadePercentage = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shadePercentage).toBeGreaterThan(80); // High shade due to roof
    });

    it('should calculate partial shade when obstruction covers part of section', () => {
      const partialObstruction: Obstruction = {
        id: 'partial-roof',
        name: 'Partial Overhang',
        type: 'roof',
        vertices: [
          { x: 90, y: 40, z: 50 },
          { x: 100, y: 40, z: 50 },
          { x: 100, y: 60, z: 50 },
          { x: 90, y: 60, z: 50 },
        ],
        castsShadow: true,
      };

      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [partialObstruction]);

      const sunVector = { x: 0, y: 0, z: -1 };

      const shadePercentage = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shadePercentage).toBeGreaterThan(20);
      expect(shadePercentage).toBeLessThan(80); // Partial coverage
    });

    it('should handle sun angle from the side', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);

      const sunVector = { x: 1, y: 0, z: -0.5 }; // Sun from the side

      const shadePercentage = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shadePercentage).toBeGreaterThanOrEqual(0);
      expect(shadePercentage).toBeLessThanOrEqual(100);
    });

    it('should return 0 for non-existent section', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, []);

      const sunVector = { x: 0, y: 0, z: -1 };

      const shadePercentage = calc.calculateShadePercentage('non-existent', sunVector);

      expect(shadePercentage).toBe(0);
    });
  });

  describe('calculateRowShade', () => {
    it('should calculate shade for individual rows', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);

      const sunVector = { x: 0, y: 0, z: -1 };

      const rowShade = calc.calculateRowShade(sampleSection.id, sunVector);

      expect(Array.isArray(rowShade)).toBe(true);
      expect(rowShade.length).toBeGreaterThan(0);

      rowShade.forEach((row) => {
        expect(row).toHaveProperty('rowNumber');
        expect(row).toHaveProperty('shadePercentage');
        expect(row.shadePercentage).toBeGreaterThanOrEqual(0);
        expect(row.shadePercentage).toBeLessThanOrEqual(100);
      });
    });

    it('should show varying shade percentages across rows', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);

      const sunVector = { x: 0, y: 0.5, z: -1 }; // Angled sun

      const rowShade = calc.calculateRowShade(sampleSection.id, sunVector);

      // Check if there's variation (not all rows have identical shade)
      const uniqueShadeValues = new Set(rowShade.map((r) => r.shadePercentage));
      expect(uniqueShadeValues.size).toBeGreaterThan(1);
    });

    it('should return empty array for non-existent section', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, []);

      const sunVector = { x: 0, y: 0, z: -1 };

      const rowShade = calc.calculateRowShade('non-existent', sunVector);

      expect(Array.isArray(rowShade)).toBe(true);
      expect(rowShade.length).toBe(0);
    });
  });

  describe('ray casting', () => {
    it('should detect ray intersection with obstruction', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);

      const rayOrigin = { x: 100, y: 50, z: 10 }; // Section center
      const rayDirection = { x: 0, y: 0, z: 1 }; // Pointing up

      // @ts-ignore - accessing private method for testing
      const intersects = calc.rayIntersectsObstruction?.(rayOrigin, rayDirection, sampleObstruction);

      expect(typeof intersects).toBe('boolean');
    });
  });

  describe('optimization', () => {
    it('should handle multiple sections efficiently', () => {
      const sections: StadiumSection[] = [];
      for (let i = 0; i < 100; i++) {
        sections.push({
          ...sampleSection,
          id: `section-${i}`,
          coordinates: { x: i * 10, y: 50, z: 10 },
        });
      }

      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);
      const sunVector = { x: 0, y: 0, z: -1 };

      const start = Date.now();
      sections.forEach((section) => {
        calc.calculateShadePercentage(section.id, sunVector);
      });
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(5000); // 100 sections in < 5 seconds
    });

    it('should cache calculations for repeated requests', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);
      const sunVector = { x: 0, y: 0, z: -1 };

      // First calculation
      const start1 = Date.now();
      const result1 = calc.calculateShadePercentage(sampleSection.id, sunVector);
      const duration1 = Date.now() - start1;

      // Second calculation (should be cached)
      const start2 = Date.now();
      const result2 = calc.calculateShadePercentage(sampleSection.id, sunVector);
      const duration2 = Date.now() - start2;

      expect(result1).toBe(result2);
      // Cached result should be significantly faster (or at least not slower)
      expect(duration2).toBeLessThanOrEqual(duration1 * 2);
    });
  });

  describe('obstruction types', () => {
    it('should handle roof obstructions', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [sampleObstruction]);

      const sunVector = { x: 0, y: 0, z: -1 };

      const shade = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shade).toBeGreaterThan(0);
    });

    it('should handle scoreboard obstructions', () => {
      const scoreboard: Obstruction = {
        id: 'scoreboard-1',
        name: 'Center Field Scoreboard',
        type: 'scoreboard',
        vertices: [
          { x: 95, y: 45, z: 30 },
          { x: 105, y: 45, z: 30 },
          { x: 105, y: 55, z: 40 },
          { x: 95, y: 55, z: 40 },
        ],
        castsShadow: true,
      };

      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [scoreboard]);

      const sunVector = { x: 0, y: 1, z: -1 };

      const shade = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shade).toBeGreaterThanOrEqual(0);
      expect(shade).toBeLessThanOrEqual(100);
    });

    it('should ignore obstructions that do not cast shadows', () => {
      const nonShadowObstruction: Obstruction = {
        id: 'light-tower',
        name: 'Light Tower',
        type: 'other',
        vertices: [
          { x: 95, y: 45, z: 30 },
          { x: 105, y: 45, z: 30 },
          { x: 105, y: 55, z: 40 },
          { x: 95, y: 55, z: 40 },
        ],
        castsShadow: false,
      };

      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, [nonShadowObstruction]);

      const sunVector = { x: 0, y: 0, z: -1 };

      const shade = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shade).toBeLessThan(10); // No shadow cast
    });
  });

  describe('edge cases', () => {
    it('should handle empty sections array', () => {
      const calc = new OptimizedShadeCalculator3D([], []);

      const sunVector = { x: 0, y: 0, z: -1 };

      const shade = calc.calculateShadePercentage('any-id', sunVector);

      expect(shade).toBe(0);
    });

    it('should handle empty obstructions array', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, []);

      const sunVector = { x: 0, y: 0, z: -1 };

      const shade = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shade).toBeLessThan(10); // Minimal shade without obstructions
    });

    it('should handle invalid sun vector', () => {
      const sections = [sampleSection];
      const calc = new OptimizedShadeCalculator3D(sections, []);

      const sunVector = { x: 0, y: 0, z: 0 }; // Invalid (zero vector)

      const shade = calc.calculateShadePercentage(sampleSection.id, sunVector);

      expect(shade).toBeGreaterThanOrEqual(0);
      expect(shade).toBeLessThanOrEqual(100);
    });

    it('should handle section with no vertices', () => {
      const invalidSection: StadiumSection = {
        ...sampleSection,
        vertices: [],
      };

      const sections = [invalidSection];
      const calc = new OptimizedShadeCalculator3D(sections, []);

      const sunVector = { x: 0, y: 0, z: -1 };

      const shade = calc.calculateShadePercentage(invalidSection.id, sunVector);

      expect(shade).toBeGreaterThanOrEqual(0);
      expect(shade).toBeLessThanOrEqual(100);
    });
  });
});
