/**
 * Smoke Test: Verify 30 rows can be calculated without errors
 * Task 0.2 Verification Requirement
 */

import { calculateRowShadow, calculateRowShadows } from '../sunCalculator';
import type { RowDetail, DetailedSection } from '../../types/stadium-complete';

describe('Smoke Test: 30 Rows Calculation', () => {
  // Generate 30 test rows (typical stadium section)
  const testRows: RowDetail[] = Array.from({ length: 30 }, (_, i) => ({
    rowNumber: String(i + 1),
    seats: 20,
    elevation: 10 + (i * 2.5),
    depth: 2.8 + (i * 2.8),
    covered: false,
    overhangHeight: 15
  }));

  const testSection: DetailedSection = {
    id: 'smoke-test-section',
    name: 'Test Section 100',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 10,
    height: 20,
    distance: 200,
    rake: 30,
    covered: false,
    vertices3D: [],
    rows: testRows
  };

  it('should calculate shade for 30 individual rows without errors', () => {
    const results: any[] = [];

    // Calculate each row
    for (let i = 0; i < 30; i++) {
      const result = calculateRowShadow(
        testRows[i],
        testSection,
        45,  // sun altitude
        180, // sun azimuth
        0    // stadium orientation
      );

      results.push(result);

      // Validate result structure
      expect(result).toBeDefined();
      expect(result.rowNumber).toBe(String(i + 1));
      expect(result.coverage).toBeGreaterThanOrEqual(0);
      expect(result.coverage).toBeLessThanOrEqual(100);
      expect(result.sunExposure).toBeGreaterThanOrEqual(0);
      expect(result.sunExposure).toBeLessThanOrEqual(100);
      expect(typeof result.inShadow).toBe('boolean');
    }

    expect(results.length).toBe(30);
  });

  it('should calculate shade for 30 rows in batch without errors', () => {
    const result = calculateRowShadows(testSection, 45, 180, 0);

    expect(result).toBeDefined();
    expect(result.sectionId).toBe('smoke-test-section');
    expect(result.rows.length).toBe(30);
    expect(result.averageCoverage).toBeGreaterThanOrEqual(0);
    expect(result.averageCoverage).toBeLessThanOrEqual(100);
    expect(result.bestRows.length).toBeGreaterThan(0);
    expect(result.worstRows.length).toBeGreaterThan(0);
  });

  it('should complete 30-row calculation quickly (<50ms)', () => {
    const startTime = Date.now();
    calculateRowShadows(testSection, 45, 180, 0);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(50);
  });
});
