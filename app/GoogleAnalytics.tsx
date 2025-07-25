'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    console.log('Sending pageview:', url);
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    console.log('Sending event:', { action, category, label, value });
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait for gtag to be available
    const checkAndSendPageview = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        pageview(pathname);
      } else {
        // Retry after a short delay
        setTimeout(checkAndSendPageview, 100);
      }
    };
    
    checkAndSendPageview();
  }, [pathname]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded');
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false, // We'll send page views manually
            custom_map: {
              'dimension1': 'app_type'
            }
          });
          
          // Debug: Log that GA is initialized
          console.log('Google Analytics initialized with ID: ${GA_MEASUREMENT_ID}');
          
          // Set custom dimension for app type
          gtag('set', {
            'app_type': 'nextjs'
          });
          
          // Send initial page view with enhanced data
          gtag('event', 'page_view', {
            page_path: window.location.pathname,
            page_location: window.location.href,
            page_title: document.title,
            app_type: 'nextjs'
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}