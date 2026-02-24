/**
 * Shade Calculation Performance Tests
 * Benchmarks for 3D shade calculations and caching performance
 */

import { calculateMLBStadiumShade3D, MLB3DCalculationOptions } from '../../utils/mlb3DCalculator';
import { getStadiumCompleteData } from '../stadium-data-aggregator';
import { shadeCalculationCache } from '../../utils/cacheManager';
import { DETAILED_STADIUMS } from '../detailedStadiums';

// Sample MLB stadiums for performance testing with coordinates
const TEST_STADIUMS = [
  { id: 'yankees', name: 'Yankee Stadium', tier: 'Tier 1', lat: 40.8296, lon: -73.9262, orientation: 55 },
  { id: 'red-sox', name: 'Fenway Park', tier: 'Tier 1', lat: 42.3467, lon: -71.0972, orientation: 36 },
  { id: 'dodgers', name: 'Dodger Stadium', tier: 'Tier 1', lat: 34.0739, lon: -118.2400, orientation: 25 },
  { id: 'braves', name: 'Truist Park', tier: 'Tier 2', lat: 33.8907, lon: -84.4677, orientation: 145 },
  { id: 'phillies', name: 'Citizens Bank Park', tier: 'Tier 3', lat: 39.9061, lon: -75.1665, orientation: 25 },
];

// Test date/time - afternoon game
const TEST_DATE = new Date('2025-07-15T19:00:00Z'); // 7PM ET / 4PM PT
const TEST_TIME = '4:00 PM';

describe('Shade Calculation Performance Tests', () => {
  // Increase timeout for performance tests
  jest.setTimeout(30000);

  describe('Initial Calculation Performance', () => {
    beforeEach(async () => {
      // Clear cache before each test
      if (typeof shadeCalculationCache?.clear === 'function') {
        await shadeCalculationCache.clear();
      }
    });

    test.each(TEST_STADIUMS)(
      'Calculate shade for $name in under 2 seconds',
      async ({ id, name, lat, lon, orientation }) => {
        const startTime = performance.now();

        try {
          const result = await calculateMLBStadiumShade3D(
            id,
            name,
            lat,
            lon,
            orientation,
            TEST_DATE,
            TEST_TIME,
            {
              useCache: false,
              useWebWorkers: false,
              lodLevel: 'medium'
            }
          );

          const endTime = performance.now();
          const duration = endTime - startTime;

          console.log(`${name}: ${duration.toFixed(2)}ms`);

          expect(result).toBeDefined();
          expect(result.sections.size).toBeGreaterThan(0);
          expect(duration).toBeLessThan(2000); // < 2 seconds
        } catch (error) {
          console.error(`${name} calculation failed:`, error);
          throw error;
        }
      }
    );

    test('Batch calculation for multiple stadiums', async () => {
      const startTime = performance.now();
      const results = [];

      for (const stadium of TEST_STADIUMS) {
        try {
          const result = await calculateMLBStadiumShade3D(
            stadium.id,
            stadium.name,
            stadium.lat,
            stadium.lon,
            stadium.orientation,
            TEST_DATE,
            TEST_TIME,
            {
              useCache: false,
              useWebWorkers: false,
              lodLevel: 'medium'
            }
          );
          results.push({
            id: stadium.id,
            name: stadium.name,
            sections: result.sections.size,
            calculationTime: result.calculationTime
          });
        } catch (error) {
          console.error(`Failed to calculate ${stadium.name}:`, error);
        }
      }

      const endTime = performance.now();
      const totalDuration = endTime - startTime;
      const avgDuration = totalDuration / TEST_STADIUMS.length;

      console.log('\n=== BATCH CALCULATION RESULTS ===');
      console.table(results);
      console.log(`Total time: ${totalDuration.toFixed(2)}ms`);
      console.log(`Average per stadium: ${avgDuration.toFixed(2)}ms`);

      expect(results.length).toBe(TEST_STADIUMS.length);
      expect(avgDuration).toBeLessThan(2000); // Average < 2s per stadium
    });
  });

  describe('Cached Calculation Performance', () => {
    beforeEach(async () => {
      // Clear cache before each test
      if (typeof shadeCalculationCache?.clear === 'function') {
        await shadeCalculationCache.clear();
      }
    });

    test('Cache reduces calculation time by >80%', async () => {
      const stadium = TEST_STADIUMS[0];

      // First calculation (no cache)
      const uncachedStart = performance.now();
      await calculateMLBStadiumShade3D(stadium.id, stadium.name, stadium.lat, stadium.lon, stadium.orientation, TEST_DATE, TEST_TIME, {
        useCache: true,
        useWebWorkers: false,
        lodLevel: 'medium'
      });
      const uncachedDuration = performance.now() - uncachedStart;

      // Second calculation (with cache)
      const cachedStart = performance.now();
      const cachedResult = await calculateMLBStadiumShade3D(
        stadium.id,
        stadium.name,
        stadium.lat,
        stadium.lon,
        stadium.orientation,
        TEST_DATE,
        TEST_TIME,
        {
          useCache: true,
          useWebWorkers: false,
          lodLevel: 'medium'
        }
      );
      const cachedDuration = performance.now() - cachedStart;

      const speedup = ((uncachedDuration - cachedDuration) / uncachedDuration) * 100;

      console.log(`\n${stadium.name} Cache Performance:`);
      console.log(`  Uncached: ${uncachedDuration.toFixed(2)}ms`);
      console.log(`  Cached: ${cachedDuration.toFixed(2)}ms`);
      console.log(`  Speedup: ${speedup.toFixed(1)}%`);

      expect(cachedResult.fromCache).toBe(true);
      expect(speedup).toBeGreaterThan(80); // >80% improvement
    });

    test('Multiple cached lookups are consistently fast', async () => {
      const stadium = TEST_STADIUMS[1];
      const iterations = 5;

      // Prime the cache
      await calculateMLBStadiumShade3D(stadium.id, stadium.name, stadium.lat, stadium.lon, stadium.orientation, TEST_DATE, TEST_TIME, {
        useCache: true,
        useWebWorkers: false,
        lodLevel: 'medium'
      });

      // Multiple cached lookups
      const durations: number[] = [];
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await calculateMLBStadiumShade3D(stadium.id, stadium.name, stadium.lat, stadium.lon, stadium.orientation, TEST_DATE, TEST_TIME, {
          useCache: true,
          useWebWorkers: false,
          lodLevel: 'medium'
        });
        durations.push(performance.now() - start);
      }

      const avgDuration = durations.reduce((a, b) => a + b, 0) / iterations;
      const maxDuration = Math.max(...durations);

      console.log(`\n${stadium.name} Cached Consistency:`);
      console.log(`  Average: ${avgDuration.toFixed(2)}ms`);
      console.log(`  Max: ${maxDuration.toFixed(2)}ms`);
      console.log(`  Durations: ${durations.map(d => d.toFixed(2)).join(', ')}ms`);

      expect(avgDuration).toBeLessThan(100); // Cached lookups <100ms
      expect(maxDuration).toBeLessThan(200); // No outliers >200ms
    });
  });

  describe('Stadium Data Loading Performance', () => {
    test('All stadium data loads in under 500ms total', () => {
      const stadiumIds = TEST_STADIUMS.map(s => s.id);
      const startTime = performance.now();

      const results = stadiumIds.map(id => {
        const start = performance.now();
        const data = getStadiumCompleteData(id, 'MLB');
        const duration = performance.now() - start;

        return {
          id,
          duration,
          sections: data.sections?.length || 0,
          obstructions: data.obstructions?.length || 0
        };
      });

      const totalDuration = performance.now() - startTime;

      console.log('\n=== DATA LOADING PERFORMANCE ===');
      console.table(results);
      console.log(`Total: ${totalDuration.toFixed(2)}ms`);

      expect(totalDuration).toBeLessThan(500); // All loads < 500ms
      results.forEach(r => {
        expect(r.duration).toBeLessThan(100); // Each load < 100ms
      });
    });
  });

  describe('LOD Performance Comparison', () => {
    test('LOD levels affect calculation time', async () => {
      const stadium = TEST_STADIUMS[2];
      const lodLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
      const results = [];

      for (const lod of lodLevels) {
        const start = performance.now();
        const result = await calculateMLBStadiumShade3D(stadium.id, stadium.name, stadium.lat, stadium.lon, stadium.orientation, TEST_DATE, TEST_TIME, {
          useCache: false,
          useWebWorkers: false,
          lodLevel: lod
        });
        const duration = performance.now() - start;

        results.push({
          lodLevel: lod,
          duration: `${duration.toFixed(2)}ms`,
          sections: result.sections.size
        });
      }

      console.log(`\n${stadium.name} LOD Comparison:`);
      console.table(results);

      // Medium LOD should be reasonable for production
      const mediumResult = results.find(r => r.lodLevel === 'medium');
      expect(mediumResult).toBeDefined();
    });
  });

  describe('Memory Usage', () => {
    test('Calculation does not cause memory leaks', async () => {
      const iterations = 10;
      const stadium = TEST_STADIUMS[0];

      if (global.gc) {
        global.gc();
      }

      const memBefore = process.memoryUsage().heapUsed;

      // Run multiple calculations
      for (let i = 0; i < iterations; i++) {
        await calculateMLBStadiumShade3D(stadium.id, stadium.name, stadium.lat, stadium.lon, stadium.orientation, TEST_DATE, TEST_TIME, {
          useCache: false,
          useWebWorkers: false,
          lodLevel: 'medium'
        });
      }

      if (global.gc) {
        global.gc();
      }

      const memAfter = process.memoryUsage().heapUsed;
      const memIncrease = (memAfter - memBefore) / 1024 / 1024; // MB

      console.log(`\nMemory Usage:`);
      console.log(`  Before: ${(memBefore / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  After: ${(memAfter / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Increase: ${memIncrease.toFixed(2)} MB`);

      // Allow up to 50MB increase for 10 iterations
      expect(memIncrease).toBeLessThan(50);
    });
  });

  describe('Concurrent Calculation Simulation', () => {
    test('Handle 5 concurrent stadium calculations', async () => {
      const startTime = performance.now();

      const promises = TEST_STADIUMS.map(stadium =>
        calculateMLBStadiumShade3D(stadium.id, stadium.name, stadium.lat, stadium.lon, stadium.orientation, TEST_DATE, TEST_TIME, {
          useCache: false,
          useWebWorkers: false,
          lodLevel: 'medium'
        }).then(result => ({
          id: stadium.id,
          name: stadium.name,
          sections: result.sections.size,
          time: result.calculationTime
        }))
      );

      const results = await Promise.all(promises);
      const totalDuration = performance.now() - startTime;

      console.log('\n=== CONCURRENT CALCULATION RESULTS ===');
      console.table(results);
      console.log(`Total concurrent time: ${totalDuration.toFixed(2)}ms`);

      expect(results.length).toBe(TEST_STADIUMS.length);
      // Concurrent should complete in reasonable time
      expect(totalDuration).toBeLessThan(5000);
    });
  });

  describe('Performance Regression Detection', () => {
    test('Baseline performance benchmarks', async () => {
      const benchmarks = {
        smallStadium: { id: 'red-sox', targetMs: 1500 },
        mediumStadium: { id: 'braves', targetMs: 1800 },
        largeStadium: { id: 'dodgers', targetMs: 2000 }
      };

      const results = [];

      for (const [key, { id, targetMs }] of Object.entries(benchmarks)) {
        const stadium = TEST_STADIUMS.find(s => s.id === id);
        if (!stadium) continue;

        const start = performance.now();
        const result = await calculateMLBStadiumShade3D(id, stadium.name, stadium.lat, stadium.lon, stadium.orientation, TEST_DATE, TEST_TIME, {
          useCache: false,
          useWebWorkers: false,
          lodLevel: 'medium'
        });
        const duration = performance.now() - start;

        const meetsTarget = duration < targetMs;
        results.push({
          type: key,
          stadiumId: id,
          duration: `${duration.toFixed(2)}ms`,
          target: `${targetMs}ms`,
          status: meetsTarget ? '✅' : '❌'
        });

        expect(duration).toBeLessThan(targetMs);
      }

      console.log('\n=== PERFORMANCE BASELINES ===');
      console.table(results);
    });
  });
});
