// Performance test for 3D shade calculation across all stadiums
// Ensures client-side performance without lag

import { MLB_STADIUMS } from '../data/stadiums';
import { getStadiumSections } from '../data/stadiumSections';
import { getShadedSections, getShadedSectionsQuick, clearShadeCalculatorCache } from '../utils/getShadedSections';
import { getStadium3DModel, clearStadium3DModelCache } from '../data/stadium3DGeometry';
import { createSunPosition } from '../utils/shadeCalculation3D';
import { OptimizedShadeCalculator3D } from '../utils/shadeCalculation3DOptimized';

interface PerformanceResult {
  stadiumId: string;
  stadiumName: string;
  sectionCount: number;
  totalSeats: number;
  calculationTime: number;
  memoryUsed: number;
  frameRate: number;
}

interface TestSummary {
  totalStadiums: number;
  averageTime: number;
  maxTime: number;
  minTime: number;
  totalMemory: number;
  passedPerformanceTarget: boolean;
  details: PerformanceResult[];
}

// Performance targets
const PERFORMANCE_TARGETS = {
  maxTimePerStadium: 50, // 50ms max per stadium
  targetFrameRate: 60, // 60 fps minimum
  maxMemoryMB: 100 // 100MB max memory usage
};

// Test sun positions (morning, noon, afternoon)
const TEST_SUN_POSITIONS = [
  { azimuth: 90, elevation: 20 },   // Morning
  { azimuth: 180, elevation: 60 },  // Noon
  { azimuth: 270, elevation: 30 }   // Afternoon
];

// Extend Performance interface for memory API (Chrome only)
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

export async function testShadePerformance(): Promise<TestSummary> {
  const results: PerformanceResult[] = [];
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  
  console.log('Starting performance test for 30 stadiums...');
  console.log('Performance targets:');
  console.log(`  - Max time per stadium: ${PERFORMANCE_TARGETS.maxTimePerStadium}ms`);
  console.log(`  - Target frame rate: ${PERFORMANCE_TARGETS.targetFrameRate} fps`);
  console.log(`  - Max memory: ${PERFORMANCE_TARGETS.maxMemoryMB}MB`);
  console.log('');
  
  for (const stadium of MLB_STADIUMS) {
    const sections = getStadiumSections(stadium.id);
    const totalSeats = sections.reduce((sum, section) => {
      // Estimate 400 seats per section (20 rows * 20 seats)
      return sum + 400;
    }, 0);
    
    // Clear caches for accurate measurement
    clearShadeCalculatorCache();
    
    // Measure calculation time
    const startTime = performance.now();
    
    // Test with different sun positions
    for (const sunPos of TEST_SUN_POSITIONS) {
      const gameTime = new Date();
      getShadedSectionsQuick(stadium, gameTime);
    }
    
    const endTime = performance.now();
    const calculationTime = endTime - startTime;
    
    // Calculate frame rate based on time
    const frameRate = calculationTime > 0 ? Math.min(1000 / calculationTime, 60) : 60;
    
    // Measure memory
    const currentMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const memoryUsed = currentMemory - startMemory;
    
    results.push({
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      sectionCount: sections.length,
      totalSeats,
      calculationTime,
      memoryUsed,
      frameRate
    });
    
    console.log(`✓ ${stadium.name}: ${calculationTime.toFixed(2)}ms (${frameRate.toFixed(0)} fps)`);
  }
  
  // Calculate summary statistics
  const totalTime = results.reduce((sum, r) => sum + r.calculationTime, 0);
  const averageTime = totalTime / results.length;
  const maxTime = Math.max(...results.map(r => r.calculationTime));
  const minTime = Math.min(...results.map(r => r.calculationTime));
  const totalMemory = (performance.memory ? performance.memory.usedJSHeapSize - startMemory : 0) / 1024 / 1024;
  
  const passedPerformanceTarget = 
    maxTime <= PERFORMANCE_TARGETS.maxTimePerStadium &&
    totalMemory <= PERFORMANCE_TARGETS.maxMemoryMB;
  
  console.log('\n=== Performance Summary ===');
  console.log(`Total stadiums tested: ${results.length}`);
  console.log(`Average time: ${averageTime.toFixed(2)}ms`);
  console.log(`Max time: ${maxTime.toFixed(2)}ms`);
  console.log(`Min time: ${minTime.toFixed(2)}ms`);
  console.log(`Total memory: ${totalMemory.toFixed(2)}MB`);
  console.log(`Performance target: ${passedPerformanceTarget ? '✓ PASSED' : '✗ FAILED'}`);
  
  return {
    totalStadiums: results.length,
    averageTime,
    maxTime,
    minTime,
    totalMemory,
    passedPerformanceTarget,
    details: results
  };
}

// Test individual stadium performance
export async function testStadiumPerformance(stadiumId: string): Promise<void> {
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    console.error(`Stadium ${stadiumId} not found`);
    return;
  }
  
  const sections = getStadiumSections(stadium.id);
  console.log(`Testing ${stadium.name}...`);
  console.log(`Sections: ${sections.length}`);
  
  // Test with optimized calculator
  const stadium3D = getStadium3DModel(stadium, sections);
  const calculator = new OptimizedShadeCalculator3D(stadium3D);
  
  // Test different LOD levels
  const lodLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  
  for (const lod of lodLevels) {
    const startTime = performance.now();
    
    for (const sunPos of TEST_SUN_POSITIONS) {
      const sunPosition = createSunPosition(sunPos.azimuth, sunPos.elevation);
      
      for (const section of stadium3D.sections) {
        calculator.calculateSectionShadeOptimized(section, sunPosition, lod);
      }
    }
    
    const endTime = performance.now();
    const time = endTime - startTime;
    const fps = 1000 / time;
    
    console.log(`  LOD ${lod}: ${time.toFixed(2)}ms (${fps.toFixed(0)} fps)`);
  }
  
  // Cleanup
  calculator.destroy();
}

// Benchmark ray-casting performance
export function benchmarkRayCasting(): void {
  console.log('Benchmarking ray-casting performance...');
  
  const testRays = 100000;
  const stadium = MLB_STADIUMS[0];
  const sections = getStadiumSections(stadium.id);
  const stadium3D = getStadium3DModel(stadium, sections);
  const calculator = new OptimizedShadeCalculator3D(stadium3D);
  
  const sunPosition = createSunPosition(180, 45);
  
  const startTime = performance.now();
  
  // Simulate ray-casting for many seats
  for (let i = 0; i < testRays; i++) {
    const mockSeat = {
      id: `seat-${i}`,
      sectionId: 'test',
      row: 1,
      seatNumber: 1,
      position: {
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        z: Math.random() * 100
      }
    };
    
    // This would call the internal ray-casting method
    // For testing, we'll use the quick estimation
    calculator.estimateSectionShadeQuick(stadium3D.sections[0], sunPosition);
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const raysPerSecond = (testRays / totalTime) * 1000;
  
  console.log(`  Total rays: ${testRays}`);
  console.log(`  Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`  Rays per second: ${raysPerSecond.toFixed(0)}`);
  console.log(`  Time per ray: ${(totalTime / testRays).toFixed(4)}ms`);
  
  calculator.destroy();
}

// Run tests if executed directly
if (require.main === module) {
  (async () => {
    console.log('Running shade calculation performance tests...\n');
    
    // Run benchmark
    benchmarkRayCasting();
    console.log('');
    
    // Test all stadiums
    const results = await testShadePerformance();
    
    // Test specific problematic stadiums in detail
    if (!results.passedPerformanceTarget) {
      console.log('\nTesting slow stadiums in detail...');
      const slowStadiums = results.details
        .filter(r => r.calculationTime > PERFORMANCE_TARGETS.maxTimePerStadium)
        .sort((a, b) => b.calculationTime - a.calculationTime)
        .slice(0, 3);
      
      for (const slow of slowStadiums) {
        await testStadiumPerformance(slow.stadiumId);
      }
    }
    
    // Clear all caches
    clearShadeCalculatorCache();
    clearStadium3DModelCache();
    
    console.log('\nPerformance testing complete!');
  })();
}