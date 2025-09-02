/**
 * Data Retention Policy Implementation
 * Manages automatic cleanup of user data based on defined retention periods
 */

export interface RetentionPolicy {
  category: string;
  description: string;
  retentionDays: number;
  dataKeys: string[];
  storageType: 'localStorage' | 'sessionStorage' | 'cookies';
}

// Define retention policies for different data categories
export const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    category: 'Essential Preferences',
    description: 'Core settings and preferences',
    retentionDays: 365, // 1 year
    dataKeys: [
      'cookie_consent',
      'cookie_consent_date',
      'gpc_honored',
      'gpc_honored_date',
      'gpc_auto_applied',
      'theme_preference',
      'i18n_language'
    ],
    storageType: 'localStorage'
  },
  {
    category: 'Stadium Preferences',
    description: 'Stadium favorites and viewing preferences',
    retentionDays: 365, // 1 year
    dataKeys: [
      'mlb-sun-tracker-preferences',
      'favorite_stadiums',
      'mlb-sun-tracker-profiles'
    ],
    storageType: 'localStorage'
  },
  {
    category: 'Recent Activity',
    description: 'Recent searches and viewed stadiums',
    retentionDays: 90, // 90 days
    dataKeys: [
      'recent_stadiums',
      'lastUsedDate',
      'lastUsedTime',
      'viewMode'
    ],
    storageType: 'localStorage'
  },
  {
    category: 'Session Data',
    description: 'Temporary session information',
    retentionDays: 30, // 30 days
    dataKeys: [
      'privacy_audit_log',
      'hapticSettings'
    ],
    storageType: 'sessionStorage'
  },
  {
    category: 'Analytics',
    description: 'Analytics and tracking cookies',
    retentionDays: 90, // 90 days
    dataKeys: [
      '_ga',
      '_ga_*',
      '_gid',
      '_gat_*'
    ],
    storageType: 'cookies'
  }
];

interface DataItem {
  key: string;
  value: any;
  timestamp?: number;
  expiry?: number;
}

/**
 * Add timestamp to data when storing
 */
export function wrapWithTimestamp(data: any): any {
  return {
    value: data,
    timestamp: Date.now(),
    _retention_wrapped: true
  };
}

/**
 * Unwrap timestamped data
 */
export function unwrapTimestampedData(data: any): { value: any; timestamp: number | null } {
  if (data && typeof data === 'object' && data._retention_wrapped) {
    return {
      value: data.value,
      timestamp: data.timestamp
    };
  }
  return {
    value: data,
    timestamp: null
  };
}

/**
 * Check if data item has expired based on retention policy
 */
export function isExpired(timestamp: number, retentionDays: number): boolean {
  const now = Date.now();
  const expiryTime = timestamp + (retentionDays * 24 * 60 * 60 * 1000);
  return now > expiryTime;
}

/**
 * Clean expired data from localStorage
 */
export function cleanLocalStorage(): number {
  if (typeof window === 'undefined') return 0;
  
  let cleanedCount = 0;
  const now = Date.now();
  
  // Get all localStorage keys
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  
  // Check each key against retention policies
  keys.forEach(key => {
    const policy = RETENTION_POLICIES.find(p => 
      p.storageType === 'localStorage' && 
      p.dataKeys.some(dataKey => {
        // Handle wildcard patterns
        if (dataKey.includes('*')) {
          const pattern = dataKey.replace('*', '.*');
          return new RegExp(pattern).test(key);
        }
        return dataKey === key;
      })
    );
    
    if (policy) {
      try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          const parsed = JSON.parse(storedValue);
          const { value, timestamp } = unwrapTimestampedData(parsed);
          
          if (timestamp && isExpired(timestamp, policy.retentionDays)) {
            localStorage.removeItem(key);
            cleanedCount++;
            console.log(`[Data Retention] Removed expired item: ${key} (${policy.category})`);
          }
        }
      } catch (e) {
        // If not JSON or no timestamp, check if key itself indicates age
        // For now, skip non-timestamped data
      }
    }
  });
  
  return cleanedCount;
}

/**
 * Clean expired data from sessionStorage
 */
export function cleanSessionStorage(): number {
  if (typeof window === 'undefined') return 0;
  
  let cleanedCount = 0;
  const now = Date.now();
  
  // Get all sessionStorage keys
  const keys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) keys.push(key);
  }
  
  // Check each key against retention policies
  keys.forEach(key => {
    const policy = RETENTION_POLICIES.find(p => 
      p.storageType === 'sessionStorage' && 
      p.dataKeys.includes(key)
    );
    
    if (policy) {
      try {
        const storedValue = sessionStorage.getItem(key);
        if (storedValue) {
          const parsed = JSON.parse(storedValue);
          const { value, timestamp } = unwrapTimestampedData(parsed);
          
          if (timestamp && isExpired(timestamp, policy.retentionDays)) {
            sessionStorage.removeItem(key);
            cleanedCount++;
            console.log(`[Data Retention] Removed expired session item: ${key}`);
          }
        }
      } catch (e) {
        // Skip non-timestamped data
      }
    }
  });
  
  return cleanedCount;
}

/**
 * Clean expired cookies
 */
export function cleanCookies(): number {
  if (typeof document === 'undefined') return 0;
  
  let cleanedCount = 0;
  const cookies = document.cookie.split(';');
  
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (!name) return;
    
    const policy = RETENTION_POLICIES.find(p => 
      p.storageType === 'cookies' && 
      p.dataKeys.some(dataKey => {
        if (dataKey.includes('*')) {
          const pattern = dataKey.replace('*', '.*');
          return new RegExp(pattern).test(name);
        }
        return dataKey === name;
      })
    );
    
    // For cookies, we rely on their built-in expiry mechanism
    // This function is mainly for logging and tracking
    if (policy) {
      console.log(`[Data Retention] Cookie ${name} governed by ${policy.category} policy (${policy.retentionDays} days)`);
    }
  });
  
  return cleanedCount;
}

/**
 * Run complete data retention cleanup
 */
export async function runDataRetentionCleanup(): Promise<{
  success: boolean;
  itemsCleaned: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let totalCleaned = 0;
  
  try {
    // Clean localStorage
    const localStorageCleaned = cleanLocalStorage();
    totalCleaned += localStorageCleaned;
    
    // Clean sessionStorage
    const sessionStorageCleaned = cleanSessionStorage();
    totalCleaned += sessionStorageCleaned;
    
    // Log cookie policies (actual cleanup handled by browser)
    cleanCookies();
    
    // Log cleanup completion
    if (totalCleaned > 0) {
      console.log(`[Data Retention] Cleanup completed. Removed ${totalCleaned} expired items.`);
      
      // Store last cleanup timestamp
      localStorage.setItem('_last_retention_cleanup', JSON.stringify({
        timestamp: Date.now(),
        itemsCleaned: totalCleaned
      }));
    }
  } catch (e) {
    errors.push(`Retention cleanup error: ${e}`);
    console.error('[Data Retention] Cleanup error:', e);
  }
  
  return {
    success: errors.length === 0,
    itemsCleaned: totalCleaned,
    errors
  };
}

/**
 * Check if retention cleanup should run
 */
export function shouldRunRetentionCleanup(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const lastCleanup = localStorage.getItem('_last_retention_cleanup');
    if (!lastCleanup) return true;
    
    const { timestamp } = JSON.parse(lastCleanup);
    const daysSinceCleanup = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    
    // Run cleanup once per day
    return daysSinceCleanup >= 1;
  } catch {
    return true;
  }
}

/**
 * Initialize retention policy enforcement
 */
export function initializeDataRetention(): void {
  if (typeof window === 'undefined') return;
  
  // Run cleanup on initialization if needed
  if (shouldRunRetentionCleanup()) {
    // Run after a short delay to not block initial page load
    setTimeout(() => {
      runDataRetentionCleanup().then(result => {
        if (result.success && result.itemsCleaned > 0) {
          console.log(`[Data Retention] Initialized - cleaned ${result.itemsCleaned} expired items`);
        }
      });
    }, 2000);
  }
  
  // Schedule periodic cleanup (every 24 hours)
  setInterval(() => {
    if (shouldRunRetentionCleanup()) {
      runDataRetentionCleanup();
    }
  }, 24 * 60 * 60 * 1000); // 24 hours
}

/**
 * Get retention policy for a specific data key
 */
export function getRetentionPolicy(dataKey: string): RetentionPolicy | null {
  return RETENTION_POLICIES.find(policy => 
    policy.dataKeys.some(key => {
      if (key.includes('*')) {
        const pattern = key.replace('*', '.*');
        return new RegExp(pattern).test(dataKey);
      }
      return key === dataKey;
    })
  ) || null;
}

/**
 * Format retention period for display
 */
export function formatRetentionPeriod(days: number): string {
  if (days === 365) return '1 year';
  if (days === 90) return '90 days';
  if (days === 30) return '30 days';
  if (days === 7) return '7 days';
  if (days === 1) return '24 hours';
  return `${days} days`;
}