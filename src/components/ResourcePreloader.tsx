import { useEffect } from 'react';

export const ResourcePreloader: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Preload critical fonts
    const fontPreloads = [
      '/fonts/inter-var.woff2',
      '/fonts/sf-pro-display.woff2',
    ];

    fontPreloads.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = font;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preconnect to API endpoints
    const apiEndpoints = [
      'https://api.open-meteo.com',
      'https://statsapi.mlb.com',
    ];

    apiEndpoints.forEach((endpoint) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = endpoint;
      document.head.appendChild(link);
    });

    // Prefetch next likely navigation
    const prefetchRoutes = ['/settings', '/about'];
    
    prefetchRoutes.forEach((route) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};