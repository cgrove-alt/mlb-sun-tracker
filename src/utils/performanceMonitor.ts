/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureRender(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(componentName)) {
        this.metrics.set(componentName, []);
      }
      
      this.metrics.get(componentName)?.push(duration);
      
      // Log slow renders
      if (duration > 16) { // More than one frame (60fps)
        console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  // Measure API call performance
  async measureApiCall<T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      if (!this.metrics.has(`api_${name}`)) {
        this.metrics.set(`api_${name}`, []);
      }
      
      this.metrics.get(`api_${name}`)?.push(duration);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`API call ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  // Get performance report
  getReport(): Record<string, {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  }> {
    const report: Record<string, any> = {};
    
    this.metrics.forEach((durations, name) => {
      if (durations.length === 0) return;
      
      const sorted = [...durations].sort((a, b) => a - b);
      const sum = sorted.reduce((a, b) => a + b, 0);
      const p95Index = Math.floor(sorted.length * 0.95);
      
      report[name] = {
        count: sorted.length,
        average: sum / sorted.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p95: sorted[p95Index] || sorted[sorted.length - 1],
      };
    });
    
    return report;
  }

  // Log performance metrics to console
  logReport(): void {
    const report = this.getReport();
    console.table(report);
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Web Vitals tracking with callback
export const trackWebVitals = (onMetric?: (metric: { name: string; value: number }) => void) => {
  if ('PerformanceObserver' in window) {
    // Track Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const value = lastEntry.startTime;
      if (onMetric) {
        onMetric({ name: 'LCP', value });
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Not supported in this browser
    }

    // Track First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventEntry = entry as any;
        if (eventEntry.processingStart) {
          const delay = eventEntry.processingStart - eventEntry.startTime;
          if (onMetric) {
            onMetric({ name: 'FID', value: delay });
          }
        }
      }
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Not supported in this browser
    }

    // Track Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutEntry = entry as any;
        if (!layoutEntry.hadRecentInput && layoutEntry.value) {
          clsValue += layoutEntry.value;
          if (onMetric) {
            onMetric({ name: 'CLS', value: clsValue });
          }
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Not supported in this browser
    }
  }
};