/**
 * Cookie utility functions for managing browser cookies
 * Provides secure cookie operations with proper attributes
 * Implements data retention policies for privacy compliance
 */

import { getRetentionPolicy } from './dataRetention';

interface CookieOptions {
  expires?: number; // Days until expiry
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with proper attributes
 */
export function setCookie(
  name: string, 
  value: string | object, 
  options: CookieOptions = {}
): boolean {
  if (typeof document === 'undefined') return false;

  try {
    // Convert objects to JSON strings
    const cookieValue = typeof value === 'object' 
      ? encodeURIComponent(JSON.stringify(value))
      : encodeURIComponent(value);

    // Check if there's a retention policy for this cookie
    const retentionPolicy = getRetentionPolicy(name);
    const defaultExpiry = retentionPolicy ? retentionPolicy.retentionDays : 365;
    
    // Default options
    const {
      expires = defaultExpiry, // Use retention policy or default to 1 year
      path = '/',
      domain,
      secure = window.location.protocol === 'https:',
      sameSite = 'lax'
    } = options;

    // Calculate expiry date
    const date = new Date();
    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    const expiresString = `expires=${date.toUTCString()}`;

    // Build cookie string
    let cookieString = `${name}=${cookieValue}; ${expiresString}; path=${path}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    if (secure) {
      cookieString += '; secure';
    }
    
    cookieString += `; samesite=${sameSite}`;

    // Set the cookie
    document.cookie = cookieString;
    
    // Verify the cookie was set
    return getCookie(name) !== null;
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
    return false;
  }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  try {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        const value = c.substring(nameEQ.length);
        try {
          // Try to parse as JSON first
          const decoded = decodeURIComponent(value);
          return JSON.parse(decoded);
        } catch {
          // If not JSON, return as string
          return decodeURIComponent(value);
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
}

/**
 * Delete a cookie
 */
export function deleteCookie(
  name: string, 
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void {
  if (typeof document === 'undefined') return;

  const { path = '/', domain } = options;
  
  // Set cookie with past expiry date to delete it
  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  
  document.cookie = cookieString;
  
  // Also try without domain in case it was set differently
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}

/**
 * Check if cookies are enabled
 */
export function cookiesEnabled(): boolean {
  if (typeof document === 'undefined') return false;
  
  try {
    // Try to set a test cookie
    const testKey = '__test_cookie__';
    setCookie(testKey, 'test', { expires: 0.0001 }); // Very short expiry
    const enabled = getCookie(testKey) !== null;
    deleteCookie(testKey);
    return enabled;
  } catch {
    return false;
  }
}

/**
 * Get all cookies as an object
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};

  const cookies: Record<string, string> = {};
  
  try {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        try {
          const decoded = decodeURIComponent(value);
          cookies[name] = JSON.parse(decoded);
        } catch {
          cookies[name] = decodeURIComponent(value);
        }
      }
    });
  } catch (error) {
    console.error('Error getting all cookies:', error);
  }
  
  return cookies;
}

// Cookie names used by the application
export const COOKIE_NAMES = {
  CONSENT: 'theshadium_cookie_consent',
  GPC_HONORED: 'theshadium_gpc_honored',
  CONSENT_DATE: 'theshadium_consent_date',
  PREFERENCES: 'theshadium_preferences',
  GA_OPT_OUT: 'theshadium_ga_opt_out'
} as const;

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

/**
 * Cookie consent specific functions
 */
export const cookieConsent = {
  /**
   * Set cookie consent preferences
   */
  setConsent(preferences: {
    necessary: boolean;
    performance: boolean;
    functional: boolean;
    timestamp: number;
  }): boolean {
    return setCookie(COOKIE_NAMES.CONSENT, preferences, {
      expires: 365, // 1 year
      sameSite: 'lax'
    });
  },

  /**
   * Get cookie consent preferences
   */
  getConsent(): any {
    return getCookie(COOKIE_NAMES.CONSENT);
  },

  /**
   * Delete cookie consent
   */
  deleteConsent(): void {
    deleteCookie(COOKIE_NAMES.CONSENT);
  },

  /**
   * Set consent date
   */
  setConsentDate(date: string): boolean {
    return setCookie(COOKIE_NAMES.CONSENT_DATE, date, {
      expires: 365,
      sameSite: 'lax'
    });
  },

  /**
   * Check if GPC was honored
   */
  isGPCHonored(): boolean {
    return getCookie(COOKIE_NAMES.GPC_HONORED) === 'true';
  },

  /**
   * Set GPC honored status
   */
  setGPCHonored(honored: boolean): boolean {
    return setCookie(COOKIE_NAMES.GPC_HONORED, honored.toString(), {
      expires: 365,
      sameSite: 'lax'
    });
  }
};

/**
 * Google Analytics specific functions
 */
export const googleAnalytics = {
  /**
   * Set Google Analytics opt-out
   */
  setOptOut(optOut: boolean): boolean {
    // Set the browser-level opt-out flag
    if (typeof window !== 'undefined') {
      if (optOut) {
        (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
      } else {
        delete (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`];
      }
    }
    
    // Save opt-out preference in cookie
    const result = setCookie(COOKIE_NAMES.GA_OPT_OUT, optOut.toString(), {
      expires: 365 * 2, // 2 years like GA cookies
      sameSite: 'lax'
    });
    
    // Clear GA cookies if opting out
    if (optOut) {
      this.clearCookies();
    }
    
    return result;
  },

  /**
   * Check if user has opted out of Google Analytics
   */
  isOptedOut(): boolean {
    // Check cookie first
    const optOutCookie = getCookie(COOKIE_NAMES.GA_OPT_OUT);
    if (optOutCookie === 'true') return true;
    
    // Check consent preferences
    const consent = cookieConsent.getConsent();
    if (consent && !consent.performance) return true;
    
    // Check browser flag
    if (typeof window !== 'undefined' && (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`]) {
      return true;
    }
    
    return false;
  },

  /**
   * Clear all Google Analytics cookies
   */
  clearCookies(): void {
    if (typeof document === 'undefined') return;
    
    const gaCookiePatterns = [
      /^_ga$/,           // Main GA cookie
      /^_gid$/,          // GA session cookie
      /^_gat/,           // GA throttle cookie
      /^_ga_/,           // GA4 cookies
      /^_gac_/,          // GA campaign cookies
      /^_gcl_/           // Google Ads cookies
    ];
    
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      const trimmedName = name.trim();
      
      if (gaCookiePatterns.some(pattern => pattern.test(trimmedName))) {
        // Delete for current domain
        document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        
        // Delete for parent domain
        const hostname = window.location.hostname;
        document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
        
        // Try deleting for each subdomain level
        const domainParts = hostname.split('.');
        for (let i = 0; i < domainParts.length - 1; i++) {
          const domain = domainParts.slice(i).join('.');
          document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
        }
      }
    });
    
    console.log('[GA] Google Analytics cookies cleared');
  },

  /**
   * Get current GA status
   */
  getStatus(): {
    optedOut: boolean;
    hasGACookies: boolean;
    consentGiven: boolean;
  } {
    const optedOut = this.isOptedOut();
    const consent = cookieConsent.getConsent();
    const consentGiven = consent ? consent.performance : false;
    
    // Check for GA cookies
    let hasGACookies = false;
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      hasGACookies = cookies.some(cookie => {
        const [name] = cookie.split('=');
        return name.trim().match(/^(_ga|_gid|_gat|_ga_)/);
      });
    }
    
    return {
      optedOut,
      hasGACookies,
      consentGiven
    };
  }
};