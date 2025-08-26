'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalyticsClient() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize GA
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}