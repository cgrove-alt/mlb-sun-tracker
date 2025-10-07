'use client';

import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
  FCP?: number;
  INP?: number;
  navigationTiming?: {
    loadTime: number;
    domContentLoaded: number;
    firstByte: number;
  };
}

export default function PerformanceMonitor() {
  const sendMetrics = useCallback(async (metrics: PerformanceMetrics) => {
    try {
      // Send to analytics endpoint
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metrics,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      });

      // Also send to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'Performance Metrics',
          value: Math.round(metrics.LCP || 0),
          non_interaction: true,
          custom_map: {
            dimension1: metrics.FID,
            dimension2: metrics.CLS,
            dimension3: metrics.TTFB,
          },
        });
      }

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Performance Metrics:', metrics);
      }
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const metrics: PerformanceMetrics = {};

    // Observe Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP not supported
    }

    // Observe First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0] as any;
        if (firstInput) {
          metrics.FID = firstInput.processingStart - firstInput.startTime;
        }
      });

      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // FID not supported
    }

    // Observe Cumulative Layout Shift (CLS)
    try {
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        metrics.CLS = clsScore;
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // CLS not supported
    }

    // Observe First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.FCP = fcpEntry.startTime;
        }
      });

      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // FCP not supported
    }

    // Get Time to First Byte (TTFB) and other navigation timings
    const getNavigationTiming = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        metrics.TTFB = navigation.responseStart - navigation.requestStart;
        metrics.navigationTiming = {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstByte: navigation.responseStart - navigation.fetchStart,
        };
      }
    };

    // Use web-vitals library if available
    const loadWebVitals = async () => {
      try {
        const { onLCP, onCLS, onFCP, onTTFB, onINP } = await import('web-vitals');

        onLCP((metric) => {
          metrics.LCP = metric.value;
          sendMetrics({ ...metrics });
        });

        onCLS((metric) => {
          metrics.CLS = metric.value;
        });

        onFCP((metric) => {
          metrics.FCP = metric.value;
        });

        onTTFB((metric) => {
          metrics.TTFB = metric.value;
        });

        onINP((metric) => {
          metrics.INP = metric.value;
          metrics.FID = metric.value; // INP replaces FID
        });
      } catch (e) {
        // web-vitals not available, use native APIs
        console.log('Using native performance APIs');
      }
    };

    // Load web-vitals library
    loadWebVitals();

    // Get navigation timing after page load
    if (document.readyState === 'complete') {
      getNavigationTiming();
    } else {
      window.addEventListener('load', getNavigationTiming);
    }

    // Send metrics when page is about to unload
    const sendBeforeUnload = () => {
      sendMetrics(metrics);
    };

    // Send metrics after 10 seconds (in case user leaves quickly)
    const timeoutId = setTimeout(() => {
      sendMetrics(metrics);
    }, 10000);

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendMetrics(metrics);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', sendBeforeUnload);

    // Report errors
    const errorHandler = (event: ErrorEvent) => {
      fetch('/api/metrics/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: event.message,
          source: event.filename,
          line: event.lineno,
          column: event.colno,
          stack: event.error?.stack,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch(console.error);
    };

    window.addEventListener('error', errorHandler);

    // Report unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      fetch('/api/metrics/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: event.reason?.message || String(event.reason),
          type: 'unhandledRejection',
          stack: event.reason?.stack,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch(console.error);
    };

    window.addEventListener('unhandledrejection', rejectionHandler);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendBeforeUnload);
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, [sendMetrics]);

  // Component doesn't render anything
  return null;
}