'use client';

import { useEffect } from 'react';

export function CSSOptimizer() {
  useEffect(() => {
    // Dynamically preload CSS based on build output
    const preloadCSS = () => {
      // Get all CSS links from the document
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      
      cssLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.includes('/_next/static/css/')) {
          // Create preload link if it doesn't exist
          const existingPreload = document.querySelector(`link[rel="preload"][href="${href}"]`);
          if (!existingPreload) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'style';
            preloadLink.href = href;
            preloadLink.crossOrigin = 'anonymous';
            document.head.insertBefore(preloadLink, link);
          }
        }
      });
    };

    // Run immediately
    preloadCSS();
    
    // Optimize loading of non-critical CSS
    const optimizeNonCriticalCSS = () => {
      const nonCriticalCSS = [
        'ErrorBoundary.css',
      ];
      
      nonCriticalCSS.forEach((filename) => {
        const links = document.querySelectorAll(`link[href*="${filename}"]`);
        links.forEach((link) => {
          // Add media="print" to defer loading
          link.setAttribute('media', 'print');
          // Change back to all once loaded
          link.addEventListener('load', () => {
            link.setAttribute('media', 'all');
          });
        });
      });
    };
    
    // Defer non-critical CSS
    if (document.readyState === 'complete') {
      optimizeNonCriticalCSS();
    } else {
      window.addEventListener('load', optimizeNonCriticalCSS);
    }
    
    // Prefetch CSS for other routes
    const prefetchRouteCSS = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Dynamically prefetch CSS based on actual build output
          // Next.js generates dynamic CSS filenames, so we can't hardcode them
          // Instead, we'll let Next.js handle CSS prefetching automatically
        });
      }
    };
    
    prefetchRouteCSS();
    
    return () => {
      window.removeEventListener('load', optimizeNonCriticalCSS);
    };
  }, []);
  
  return null;
}