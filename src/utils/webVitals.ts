/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals (LCP, FID, CLS) and sends to analytics
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Type for analytics providers
type AnalyticsProvider = 'console' | 'google-analytics' | 'custom';

interface WebVitalsConfig {
  provider: AnalyticsProvider;
  debug?: boolean;
  sampleRate?: number; // 0-1, percentage of users to track
}

const config: WebVitalsConfig = {
  provider: 'console', // Default to console logging
  debug: process.env.NODE_ENV === 'development',
  sampleRate: 1.0, // Track 100% of users
};

/**
 * Send metric to analytics provider
 */
function sendToAnalytics(metric: Metric) {
  // Sample rate check
  if (Math.random() > (config.sampleRate || 1)) {
    return;
  }

  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // Log to console in development or debug mode
  if (config.debug) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to analytics provider
  switch (config.provider) {
    case 'google-analytics':
      // Send to Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_rating: metric.rating,
        });
      }
      break;

    case 'custom':
      // Send to custom analytics endpoint
      if (typeof window !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/metrics', body);
      }
      break;

    case 'console':
    default:
      // Already logged above in debug mode
      break;
  }
}

/**
 * Get performance rating category
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FID':
    case 'INP':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
}

/**
 * Report Web Vitals with custom handling
 */
function reportWebVitals(metric: Metric) {
  // Add custom rating if not present
  if (!metric.rating) {
    (metric as any).rating = getRating(metric.name, metric.value);
  }

  sendToAnalytics(metric);
}

/**
 * Initialize Web Vitals monitoring
 * Call this once on app initialization
 */
export function initWebVitals(customConfig?: Partial<WebVitalsConfig>) {
  // Merge custom config
  if (customConfig) {
    Object.assign(config, customConfig);
  }

  // Only run in browser
  if (typeof window === 'undefined') {
    return;
  }

  // Track all Core Web Vitals
  onCLS(reportWebVitals);
  onINP(reportWebVitals); // Replaces FID in modern browsers
  onFCP(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);

  if (config.debug) {
    console.log('[Web Vitals] Monitoring initialized');
  }
}

/**
 * Get current performance metrics summary
 * Useful for debugging or displaying in UI
 */
export function getPerformanceMetrics(): Record<string, number> {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  const metrics: Record<string, number> = {};

  if (navigation) {
    metrics.dns = navigation.domainLookupEnd - navigation.domainLookupStart;
    metrics.tcp = navigation.connectEnd - navigation.connectStart;
    metrics.ttfb = navigation.responseStart - navigation.requestStart;
    metrics.download = navigation.responseEnd - navigation.responseStart;
    metrics.domInteractive = navigation.domInteractive - navigation.fetchStart;
    metrics.domComplete = navigation.domComplete - navigation.fetchStart;
    metrics.loadComplete = navigation.loadEventEnd - navigation.fetchStart;
  }

  paint.forEach((entry) => {
    if (entry.name === 'first-paint') {
      metrics.fp = entry.startTime;
    }
    if (entry.name === 'first-contentful-paint') {
      metrics.fcp = entry.startTime;
    }
  });

  return metrics;
}

/**
 * Export configuration setter for advanced usage
 */
export function configureWebVitals(customConfig: Partial<WebVitalsConfig>) {
  Object.assign(config, customConfig);
}
