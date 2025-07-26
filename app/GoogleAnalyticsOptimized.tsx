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

  // Load GA script after user interaction or timeout
  const loadGoogleAnalytics = useCallback(() => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).gtag) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.defer = true;
    
    // Initialize dataLayer before script loads
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
    });

    // Append script
    document.head.appendChild(script);

    // Send initial pageview once loaded
    script.onload = () => {
      pageview(pathname);
    };
  }, [pathname]);

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

  // Track page changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}