// Performance test for 3D shade calculation
// Verifies the algorithm runs efficiently for all 30 stadiums

import { MLB_STADIUMS } from '../data/stadiums';
import { getStadiumSections } from '../data/stadiumSections';
import { getShadedSections, getShadedSectionsQuick, getShadedSectionsForAllStadiums } from '../utils/getShadedSections';

interface PerformanceResult {
  stadiumId: string;
  stadiumName: string;
  sectionCount: number;
  calculationTime: number;
  shadedSectionCount: number;
  averageShadePercentage: number;
}

// Test individual stadium performance
async function testStadiumPerformance(stadiumId: string): Promise<PerformanceResult> {
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) throw new Error(`Stadium ${stadiumId} not found`);
  
  const sections = getStadiumSections(stadiumId);
  const gameTime = new Date('2024-07-15T13:00:00');
  
  // Measure calculation time
  const startTime = performance.now();
  const shadedSections = getShadedSectionsQuick(stadium, gameTime);
  const endTime = performance.now();
  
  // Calculate statistics
  const shadedCount = shadedSections.filter(s => s.shadePercentage > 50).length;
  const totalShade = shadedSections.reduce((sum, s) => sum + s.shadePercentage, 0);
  const averageShade = totalShade / shadedSections.length;
  
  return {
    stadiumId: stadium.id,
    stadiumName: stadium.name,
    sectionCount: sections.length,
    calculationTime: endTime - startTime,
    shadedSectionCount: shadedCount,
    averageShadePercentage: averageShade
  };
}

// Test all stadiums
export async function testAllStadiumsPerformance(): Promise<void> {
  console.log('🏟️ Testing 3D Shade Calculation Performance for All MLB Stadiums\n');
  console.log('Target: < 100ms per stadium for client-side performance\n');
  
  const results: PerformanceResult[] = [];
  let totalTime = 0;
  let maxTime = 0;
  let maxTimeStadium = '';
  
  // Test each stadium
  for (const stadium of MLB_STADIUMS) {
    try {
      const result = await testStadiumPerformance(stadium.id);
      results.push(result);
      totalTime += result.calculationTime;
      
      if (result.calculationTime > maxTime) {
        maxTime = result.calculationTime;
        maxTimeStadium = result.stadiumName;
      }
      
      // Log individual result
      const timeStatus = result.calculationTime < 100 ? '✅' : '⚠️';
      console.log(
        `${timeStatus} ${result.stadiumName}: ${result.calculationTime.toFixed(2)}ms ` +
        `(${result.sectionCount} sections, ${result.shadedSectionCount} shaded)`
      );
    } catch (error) {
      console.error(`❌ Error testing ${stadium.name}:`, error);
    }
  }
  
  // Test batch processing
  console.log('\n📊 Testing Batch Processing Performance...');
  const batchStartTime = performance.now();
  const batchResults = await getShadedSectionsForAllStadiums(new Date('2024-07-15T13:00:00'));
  const batchEndTime = performance.now();
  const batchTime = batchEndTime - batchStartTime;
  
  // Summary statistics
  console.log('\n📈 Performance Summary:');
  console.log(`Total stadiums tested: ${results.length}`);
  console.log(`Average calculation time: ${(totalTime / results.length).toFixed(2)}ms`);
  console.log(`Maximum calculation time: ${maxTime.toFixed(2)}ms (${maxTimeStadium})`);
  console.log(`Total sequential time: ${totalTime.toFixed(2)}ms`);
  console.log(`Batch processing time: ${batchTime.toFixed(2)}ms`);
  console.log(`Performance improvement: ${((totalTime / batchTime - 1) * 100).toFixed(0)}%`);
  
  // Performance verdict
  const avgTime = totalTime / results.length;
  if (avgTime < 50 && maxTime < 100) {
    console.log('\n✅ EXCELLENT: Algorithm performs well within target constraints');
  } else if (avgTime < 100 && maxTime < 200) {
    console.log('\n✅ GOOD: Algorithm meets performance requirements');
  } else {
    console.log('\n⚠️ WARNING: Algorithm may cause noticeable lag on some devices');
  }
}

// Test memory usage
export function testMemoryUsage(): void {
  console.log('\n💾 Testing Memory Usage...');
  
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memoryInfo = (performance as any).memory;
    const initialMemory = memoryInfo.usedJSHeapSize;
    
    // Load all stadium models
    MLB_STADIUMS.forEach(stadium => {
      const sections = getStadiumSections(stadium.id);
      getShadedSections(stadium, new Date('2024-07-15T13:00:00'));
    });
    
    const finalMemory = memoryInfo.usedJSHeapSize;
    const memoryUsed = (finalMemory - initialMemory) / (1024 * 1024);
    
    console.log(`Memory used for all stadium models: ${memoryUsed.toFixed(2)} MB`);
    console.log(`Average per stadium: ${(memoryUsed / MLB_STADIUMS.length).toFixed(2)} MB`);
    
    if (memoryUsed < 50) {
      console.log('✅ Memory usage is acceptable for client-side execution');
    } else {
      console.log('⚠️ High memory usage detected, consider optimization');
    }
  } else {
    console.log('Memory profiling not available in this environment');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    await testAllStadiumsPerformance();
    testMemoryUsage();
  })();
}