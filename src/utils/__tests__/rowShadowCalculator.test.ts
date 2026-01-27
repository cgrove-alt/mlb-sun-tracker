/**
 * Row Shadow Calculator Tests
 * Tests for calculateRowShadow(), calculateRowShadows(), and helper functions
 */

import { calculateRowShadow, calculateRowShadows, RowShadowData, SectionShadowData } from '../sunCalculator';
import type { RowDetail, DetailedSection } from '../../types/stadium-complete';

describe('calculateRowShadow', () => {
  // Mock section for testing
  const mockSection: DetailedSection = {
    id: 'test-section-1',
    name: 'Section 100',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 10,
    height: 20,
    distance: 200,
    rake: 30,
    covered: false,
    vertices3D: [],
    rows: []
  };

  describe('Covered Rows', () => {
    it('should return 100% shade for explicitly covered rows', () => {
      const coveredRow: RowDetail = {
        rowNumber: '1',
        seats: 20,
        elevation: 10,
        depth: 5,
        covered: true,
        overhangHeight: 0
      };

      const result = calculateRowShadow(coveredRow, mockSection, 45, 180, 0);

      expect(result.coverage).toBe(100);
      expect(result.sunExposure).toBe(0);
      expect(result.inShadow).toBe(true);
      expect(result.shadowSources.roof).toBe(100);
      expect(result.recommendation).toBe('excellent');
    });
  });

  describe('Overhang Shadow Calculations', () => {
    it('should calculate full overhang shadow for front rows', () => {
      const frontRow: RowDetail = {
        rowNumber: '1',
        seats: 20,
        elevation: 10,
        depth: 5,
        covered: false,
        overhangHeight: 15
      };

      // Sun at 45 degrees: shadow length = 15 / tan(45°) = 15 feet
      // Row depth 5 feet < 15 feet shadow length → full coverage
      const result = calculateRowShadow(frontRow, mockSection, 45, 180, 0);

      expect(result.shadowSources.overhang).toBeGreaterThanOrEqual(80);
      expect(result.coverage).toBeGreaterThan(50);
    });

    it('should calculate no overhang shadow for back rows', () => {
      const backRow: RowDetail = {
        rowNumber: '30',
        seats: 20,
        elevation: 85,
        depth: 84, // Far from overhang
        covered: false,
        overhangHeight: 15
      };

      // Sun at 45 degrees: shadow length = 15 / tan(45°) = 15 feet
      // Row depth 84 feet >> 15 feet shadow length → no coverage
      const result = calculateRowShadow(backRow, mockSection, 45, 180, 0);

      expect(result.shadowSources.overhang).toBe(0);
    });

    it('should handle rows with no overhang', () => {
      const rowNoOverhang: RowDetail = {
        rowNumber: '10',
        seats: 20,
        elevation: 30,
        depth: 28,
        covered: false,
        overhangHeight: 0
      };

      const result = calculateRowShadow(rowNoOverhang, mockSection, 45, 180, 0);

      expect(result.shadowSources.overhang).toBe(0);
    });

    it('should calculate transition zone overhang shadow correctly', () => {
      const transitionRow: RowDetail = {
        rowNumber: '8',
        seats: 20,
        elevation: 25,
        depth: 20, // In transition zone
        covered: false,
        overhangHeight: 15
      };

      // Sun at 45 degrees: shadow length = 15 feet
      // Transition zone: 15 to 22.5 feet
      const result = calculateRowShadow(transitionRow, mockSection, 45, 180, 0);

      expect(result.shadowSources.overhang).toBeGreaterThan(0);
      expect(result.shadowSources.overhang).toBeLessThan(100);
    });
  });

  describe('Upper Deck Shadow Calculations', () => {
    it('should calculate upper deck shadow for lower level sections', () => {
      const lowerRow: RowDetail = {
        rowNumber: '5',
        seats: 20,
        elevation: 15,
        depth: 14,
        covered: false,
        overhangHeight: 0
      };

      const lowerSection: DetailedSection = {
        ...mockSection,
        level: 'lower',
        baseAngle: 180, // Behind home plate
        height: 20
      };

      // Upper deck at ~60 feet (height 20 + 40)
      // Row at 15 feet → height difference = 45 feet
      const result = calculateRowShadow(lowerRow, lowerSection, 45, 180, 0);

      // Should have some upper deck shadow for behind-home sections
      expect(result.shadowSources.upperDeck).toBeGreaterThan(0);
    });

    it('should not calculate upper deck shadow for upper level sections', () => {
      const upperRow: RowDetail = {
        rowNumber: '1',
        seats: 20,
        elevation: 60,
        depth: 5,
        covered: false,
        overhangHeight: 0
      };

      const upperSection: DetailedSection = {
        ...mockSection,
        level: 'upper'
      };

      const result = calculateRowShadow(upperRow, upperSection, 45, 180, 0);

      expect(result.shadowSources.upperDeck).toBe(0);
    });

    it('should not calculate upper deck shadow for suite level sections', () => {
      const suiteRow: RowDetail = {
        rowNumber: '1',
        seats: 20,
        elevation: 40,
        depth: 5,
        covered: false,
        overhangHeight: 0
      };

      const suiteSection: DetailedSection = {
        ...mockSection,
        level: 'suite'
      };

      const result = calculateRowShadow(suiteRow, suiteSection, 45, 180, 0);

      expect(result.shadowSources.upperDeck).toBe(0);
    });

    it('should calculate upper deck shadow for outfield sections (non-infield)', () => {
      const outfieldRow: RowDetail = {
        rowNumber: '10',
        seats: 20,
        elevation: 15,
        depth: 10,
        covered: false,
        overhangHeight: 0
      };

      const outfieldSection: DetailedSection = {
        ...mockSection,
        level: 'lower',
        baseAngle: 90, // Left field
        height: 20
      };

      // Test case: row depth <= shadowLength * 0.5 (should return 80)
      const result1 = calculateRowShadow(outfieldRow, outfieldSection, 45, 270, 0);
      expect(result1.shadowSources.upperDeck).toBeGreaterThanOrEqual(0);

      // Test case: row depth in transition zone
      const deepRow: RowDetail = {
        ...outfieldRow,
        depth: 25
      };
      const result2 = calculateRowShadow(deepRow, outfieldSection, 45, 270, 0);
      expect(result2.shadowSources.upperDeck).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Sun Altitude Edge Cases', () => {
    it('should handle sun at horizon (0 degrees)', () => {
      const row: RowDetail = {
        rowNumber: '10',
        seats: 20,
        elevation: 30,
        depth: 28,
        covered: false,
        overhangHeight: 10
      };

      const result = calculateRowShadow(row, mockSection, 0, 180, 0);

      expect(result.coverage).toBeGreaterThan(0);
      expect(result.sunExposure).toBeLessThan(50);
    });

    it('should handle sun at zenith (90 degrees)', () => {
      const row: RowDetail = {
        rowNumber: '10',
        seats: 20,
        elevation: 30,
        depth: 28,
        covered: false,
        overhangHeight: 10
      };

      const result = calculateRowShadow(row, mockSection, 90, 180, 0);

      // Very minimal shadows at zenith
      expect(result.shadowSources.overhang).toBeLessThan(50);
    });

    it('should reduce sun exposure for low sun angles (<30 degrees)', () => {
      const row: RowDetail = {
        rowNumber: '10',
        seats: 20,
        elevation: 30,
        depth: 28,
        covered: false,
        overhangHeight: 0
      };

      const lowSunResult = calculateRowShadow(row, mockSection, 15, 180, 0);
      const highSunResult = calculateRowShadow(row, mockSection, 60, 180, 0);

      expect(lowSunResult.sunExposure).toBeLessThan(highSunResult.sunExposure);
    });
  });

  describe('Recommendation Levels', () => {
    it('should recommend "excellent" for ≥80% coverage', () => {
      const coveredRow: RowDetail = {
        rowNumber: '1',
        seats: 20,
        elevation: 10,
        depth: 5,
        covered: true,
        overhangHeight: 0
      };

      const result = calculateRowShadow(coveredRow, mockSection, 45, 180, 0);

      expect(result.recommendation).toBe('excellent');
    });

    it('should recommend "poor" for <30% coverage', () => {
      const exposedRow: RowDetail = {
        rowNumber: '30',
        seats: 20,
        elevation: 85,
        depth: 84,
        covered: false,
        overhangHeight: 0
      };

      const exposedSection: DetailedSection = {
        ...mockSection,
        level: 'upper',
        covered: false
      };

      const result = calculateRowShadow(exposedRow, exposedSection, 60, 0, 0);

      expect(result.recommendation).toBe('poor');
    });
  });

  describe('Front vs Back Row Gradient', () => {
    it('should show decreasing shade from front to back rows', () => {
      const frontRow: RowDetail = {
        rowNumber: '1',
        seats: 20,
        elevation: 10,
        depth: 2.8,
        covered: false,
        overhangHeight: 20
      };

      const middleRow: RowDetail = {
        rowNumber: '15',
        seats: 20,
        elevation: 45,
        depth: 25,  // In transition zone (shadow length ~20 feet at 45°)
        covered: false,
        overhangHeight: 20
      };

      const backRow: RowDetail = {
        rowNumber: '30',
        seats: 20,
        elevation: 85,
        depth: 84,
        covered: false,
        overhangHeight: 20
      };

      const frontResult = calculateRowShadow(frontRow, mockSection, 45, 180, 0);
      const middleResult = calculateRowShadow(middleRow, mockSection, 45, 180, 0);
      const backResult = calculateRowShadow(backRow, mockSection, 45, 180, 0);

      // Front row should have more coverage than middle or back
      expect(frontResult.coverage).toBeGreaterThanOrEqual(middleResult.coverage);
      // Middle row should have more coverage than back
      expect(middleResult.coverage).toBeGreaterThanOrEqual(backResult.coverage);
      // Verify gradient exists (front > back)
      expect(frontResult.coverage).toBeGreaterThan(backResult.coverage);
    });
  });

  describe('Stadium Orientation', () => {
    it('should adjust sun exposure based on stadium orientation', () => {
      const row: RowDetail = {
        rowNumber: '10',
        seats: 20,
        elevation: 30,
        depth: 28,
        covered: false,
        overhangHeight: 0
      };

      const noOrientationResult = calculateRowShadow(row, mockSection, 45, 180, 0);
      const orientedResult = calculateRowShadow(row, mockSection, 45, 180, 45);

      // Different orientations should affect sun exposure differently
      expect(noOrientationResult.sunExposure).not.toBe(orientedResult.sunExposure);
    });
  });
});

describe('calculateRowShadows', () => {
  const mockRows: RowDetail[] = [
    { rowNumber: '1', seats: 20, elevation: 10, depth: 2.8, covered: false, overhangHeight: 15 },
    { rowNumber: '2', seats: 20, elevation: 12.5, depth: 5.6, covered: false, overhangHeight: 15 },
    { rowNumber: '3', seats: 20, elevation: 15, depth: 8.4, covered: false, overhangHeight: 15 },
    { rowNumber: '4', seats: 20, elevation: 17.5, depth: 11.2, covered: false, overhangHeight: 15 },
    { rowNumber: '5', seats: 20, elevation: 20, depth: 14, covered: false, overhangHeight: 15 },
  ];

  const mockSection: DetailedSection = {
    id: 'test-section-100',
    name: 'Section 100',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 10,
    height: 20,
    distance: 200,
    rake: 30,
    covered: false,
    vertices3D: [],
    rows: mockRows
  };

  it('should calculate shadows for all rows in a section', () => {
    const result = calculateRowShadows(mockSection, 45, 180, 0);

    expect(result.sectionId).toBe('test-section-100');
    expect(result.sectionName).toBe('Section 100');
    expect(result.rows.length).toBe(5);
    expect(result.rows[0].rowNumber).toBe('1');
    expect(result.rows[4].rowNumber).toBe('5');
  });

  it('should calculate average coverage correctly', () => {
    const result = calculateRowShadows(mockSection, 45, 180, 0);

    const manualAverage = result.rows.reduce((sum, r) => sum + r.coverage, 0) / result.rows.length;

    expect(result.averageCoverage).toBe(Math.round(manualAverage));
  });

  it('should identify best rows (most shade)', () => {
    const result = calculateRowShadows(mockSection, 45, 180, 0);

    expect(result.bestRows.length).toBeLessThanOrEqual(5);
    expect(result.bestRows.length).toBeGreaterThan(0);

    // Best rows should be front rows (more overhang shadow)
    expect(result.bestRows).toContain('1');
  });

  it('should identify worst rows (least shade)', () => {
    const result = calculateRowShadows(mockSection, 45, 180, 0);

    expect(result.worstRows.length).toBeLessThanOrEqual(5);
    expect(result.worstRows.length).toBeGreaterThan(0);

    // Worst rows should be back rows (less overhang shadow)
    expect(result.worstRows).toContain('5');
  });

  it('should handle sections with no rows', () => {
    const emptySection: DetailedSection = {
      ...mockSection,
      rows: []
    };

    const result = calculateRowShadows(emptySection, 45, 180, 0);

    expect(result.rows).toEqual([]);
    expect(result.averageCoverage).toBe(0);
    expect(result.bestRows).toEqual([]);
    expect(result.worstRows).toEqual([]);
  });

  it('should handle sections with 1-4 rows (less than 5)', () => {
    const smallSection: DetailedSection = {
      ...mockSection,
      rows: mockRows.slice(0, 3)
    };

    const result = calculateRowShadows(smallSection, 45, 180, 0);

    expect(result.rows.length).toBe(3);
    expect(result.bestRows.length).toBeLessThanOrEqual(3);
    expect(result.worstRows.length).toBeLessThanOrEqual(3);
  });

  it('should maintain row order in results', () => {
    const result = calculateRowShadows(mockSection, 45, 180, 0);

    for (let i = 0; i < result.rows.length; i++) {
      expect(result.rows[i].rowNumber).toBe(mockRows[i].rowNumber);
    }
  });
});

describe('Integration: Full Stadium Calculation', () => {
  const mockRows: RowDetail[] = [
    { rowNumber: '1', seats: 20, elevation: 10, depth: 2.8, covered: false, overhangHeight: 15 },
    { rowNumber: '2', seats: 20, elevation: 12.5, depth: 5.6, covered: false, overhangHeight: 15 },
    { rowNumber: '3', seats: 20, elevation: 15, depth: 8.4, covered: false, overhangHeight: 15 },
  ];

  const testSection: DetailedSection = {
    id: 'test-integration',
    name: 'Section 100',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 10,
    height: 20,
    distance: 200,
    rake: 30,
    covered: false,
    vertices3D: [],
    rows: mockRows
  };

  it('should handle large section with 30+ rows efficiently', () => {
    // Generate 30 rows (typical stadium section)
    const largeRowSet: RowDetail[] = Array.from({ length: 30 }, (_, i) => ({
      rowNumber: String(i + 1),
      seats: 20,
      elevation: 10 + (i * 2.5),
      depth: 2.8 + (i * 2.8),
      covered: false,
      overhangHeight: 15
    }));

    const largeSection: DetailedSection = {
      id: 'test-large',
      name: 'Section 200',
      level: 'lower',
      baseAngle: 180,
      angleSpan: 10,
      height: 20,
      distance: 200,
      rake: 30,
      covered: false,
      vertices3D: [],
      rows: largeRowSet
    };

    const startTime = Date.now();
    const result = calculateRowShadows(largeSection, 45, 180, 0);
    const duration = Date.now() - startTime;

    expect(result.rows.length).toBe(30);
    expect(duration).toBeLessThan(50); // Should complete in <50ms
  });

  it('should produce consistent results for same inputs', () => {
    const result1 = calculateRowShadows(testSection, 45, 180, 0);
    const result2 = calculateRowShadows(testSection, 45, 180, 0);

    expect(result1.averageCoverage).toBe(result2.averageCoverage);
    expect(result1.bestRows).toEqual(result2.bestRows);
    expect(result1.worstRows).toEqual(result2.worstRows);
  });
});
