'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

export default function GoogleAnalyticsLazy() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load GA script after page load
  useEffect(() => {
    // Only load in production
    if (process.env.NODE_ENV !== 'production') return;

    // Delay loading GA until after initial render
    const loadGA = () => {
      // Check if already loaded
      if (window.gtag) return;

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        send_page_view: true,
      });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadGA, { timeout: 2000 });
    } else {
      setTimeout(loadGA, 2000);
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      const url = pathname + (searchParams ? `?${searchParams}` : '');
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void;
  }
}