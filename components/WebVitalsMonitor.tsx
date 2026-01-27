'use client';

import { useEffect } from 'react';
import { initWebVitals } from '../src/utils/webVitals';

/**
 * Web Vitals Monitor Component
 * Initializes performance monitoring on the client side
 */
export default function WebVitalsMonitor() {
  useEffect(() => {
    // Initialize web vitals tracking
    initWebVitals({
      provider: process.env.NODE_ENV === 'production' ? 'custom' : 'console',
      debug: process.env.NODE_ENV === 'development',
      sampleRate: 1.0, // Track 100% of users - adjust in production if needed
    });
  }, []);

  // This component doesn't render anything
  return null;
}
