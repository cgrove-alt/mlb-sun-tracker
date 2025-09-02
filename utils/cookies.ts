/**
 * Cookie utility functions for managing browser cookies
 * Provides secure cookie operations with proper attributes
 */

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

    // Default options
    const {
      expires = 365, // Default to 1 year
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
  PREFERENCES: 'theshadium_preferences'
} as const;

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