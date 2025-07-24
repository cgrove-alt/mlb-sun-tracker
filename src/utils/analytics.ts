// Google Analytics 4 tracking utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics 4 measurement ID
const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Track stadium selection
export const trackStadiumSelection = (stadiumName: string) => {
  trackEvent('select_stadium', 'engagement', stadiumName);
};

// Track game selection
export const trackGameSelection = (stadiumName: string, gameDate: string) => {
  trackEvent('select_game', 'engagement', `${stadiumName} - ${gameDate}`);
};

// Track filter usage
export const trackFilterUsage = (filterType: string, filterValue: string) => {
  trackEvent('use_filter', 'engagement', `${filterType}: ${filterValue}`);
};

// Track section view
export const trackSectionView = (sectionName: string, sunExposure: number) => {
  trackEvent('view_section', 'content', sectionName, Math.round(sunExposure));
};

// Track search
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'engagement', searchTerm, resultsCount);
};

// Track errors
export const trackError = (errorMessage: string, errorSource?: string) => {
  trackEvent('exception', 'error', `${errorSource || 'unknown'}: ${errorMessage}`);
};

// Track performance metrics
export const trackPerformance = (metricName: string, value: number) => {
  trackEvent('performance', 'technical', metricName, Math.round(value));
};

// Track user preferences
export const trackPreference = (preferenceName: string, preferenceValue: string) => {
  trackEvent('set_preference', 'user_preference', `${preferenceName}: ${preferenceValue}`);
};