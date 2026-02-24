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
      if ((window as any).gtag) return;

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      // Initialize gtag
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;

      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        send_page_view: true,
      });
    };

    // Defer GA loading until after page is fully interactive
    // Use requestIdleCallback with longer timeout to not block interactivity
    const idleCallback = (window as any).requestIdleCallback;
    if (idleCallback) {
      idleCallback(loadGA, { timeout: 5000 }); // Increased from 2000 to 5000
    } else {
      setTimeout(loadGA, 5000); // Increased from 2000 to 5000
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
      const url = pathname + (searchParams ? `?${searchParams}` : '');
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}