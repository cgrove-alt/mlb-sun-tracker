'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';

const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

// Track page views without blocking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track events without blocking
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export default function GoogleAnalyticsOptimized() {
  const pathname = usePathname();

  // Initialize gtag immediately for when the script loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      const gtag = function(...args: any[]) {
        window.dataLayer.push(args);
      };
      (window as any).gtag = gtag;
    }
  }, []);

  // Load GA script after user interaction or timeout
  const loadGoogleAnalytics = useCallback(() => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).gaLoaded) {
      return;
    }

    // Mark as loaded to prevent duplicate loading
    (window as any).gaLoaded = true;

    // Create script element
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    
    // Append script
    document.head.appendChild(script);

    // Send initial pageview once loaded
    script.onload = () => {
      console.log('Google Analytics loaded successfully');
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: true, // Enable automatic page view tracking
      });
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Analytics script');
      (window as any).gaLoaded = false;
    };
  }, []);

  useEffect(() => {
    // Strategy 1: Load after user interaction
    const events = ['click', 'scroll', 'touchstart', 'keydown'];
    let loaded = false;

    const handleInteraction = () => {
      if (!loaded) {
        loaded = true;
        loadGoogleAnalytics();
        // Remove listeners after loading
        events.forEach(event => {
          window.removeEventListener(event, handleInteraction, { capture: true });
        });
      }
    };

    // Add listeners for user interaction
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { capture: true, passive: true });
    });

    // Strategy 2: Load after 3 seconds if no interaction
    const timeout = setTimeout(() => {
      if (!loaded) {
        loaded = true;
        loadGoogleAnalytics();
      }
    }, 3000);

    // Cleanup
    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction, { capture: true });
      });
    };
  }, [loadGoogleAnalytics]);

  // Track page changes (only after GA is loaded)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag && (window as any).gaLoaded) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}