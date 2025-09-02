/**
 * Data Management Utility for Privacy Rights
 * Handles data collection, export, and deletion for GDPR/CCPA compliance
 */

export interface UserDataCategory {
  name: string;
  description: string;
  data: Record<string, any>;
  source: 'localStorage' | 'sessionStorage' | 'cookies' | 'indexedDB';
}

export interface UserDataReport {
  timestamp: string;
  requestId: string;
  categories: UserDataCategory[];
  summary: {
    totalItems: number;
    totalSize: number;
    sources: string[];
  };
}

/**
 * Collect all user data from various storage mechanisms
 */
export async function collectAllUserData(): Promise<UserDataReport> {
  const categories: UserDataCategory[] = [];
  const timestamp = new Date().toISOString();
  const requestId = `PRIVACY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 1. Collect from localStorage
  const localStorageData = collectLocalStorageData();
  if (Object.keys(localStorageData.data).length > 0) {
    categories.push(localStorageData);
  }

  // 2. Collect from sessionStorage
  const sessionStorageData = collectSessionStorageData();
  if (Object.keys(sessionStorageData.data).length > 0) {
    categories.push(sessionStorageData);
  }

  // 3. Collect from cookies
  const cookiesData = collectCookiesData();
  if (Object.keys(cookiesData.data).length > 0) {
    categories.push(cookiesData);
  }

  // 4. Check for IndexedDB (if used)
  const indexedDBData = await collectIndexedDBData();
  if (Object.keys(indexedDBData.data).length > 0) {
    categories.push(indexedDBData);
  }

  // Calculate summary
  const totalItems = categories.reduce((sum, cat) => sum + Object.keys(cat.data).length, 0);
  const totalSize = JSON.stringify(categories).length;
  const sourcesSet = new Set(categories.map(cat => cat.source));
  const sources = Array.from(sourcesSet);

  return {
    timestamp,
    requestId,
    categories,
    summary: {
      totalItems,
      totalSize,
      sources
    }
  };
}

/**
 * Collect data from localStorage
 */
function collectLocalStorageData(): UserDataCategory {
  const data: Record<string, any> = {};
  
  if (typeof window !== 'undefined' && window.localStorage) {
    // Known keys to collect
    const knownKeys = [
      'cookie_consent',
      'cookie_consent_date',
      'gpc_honored',
      'gpc_honored_date',
      'gpc_auto_applied',
      'mlb-sun-tracker-preferences',
      'hapticSettings',
      'i18n_language',
      'theme_preference',
      'recent_stadiums',
      'favorite_stadiums'
    ];

    // Collect all data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          data[key] = value ? JSON.parse(value) : value;
        } catch {
          // If not JSON, store as string
          data[key] = localStorage.getItem(key);
        }
      }
    }
  }

  return {
    name: 'Browser Storage',
    description: 'Preferences and settings stored locally in your browser',
    data,
    source: 'localStorage'
  };
}

/**
 * Collect data from sessionStorage
 */
function collectSessionStorageData(): UserDataCategory {
  const data: Record<string, any> = {};
  
  if (typeof window !== 'undefined' && window.sessionStorage) {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        try {
          const value = sessionStorage.getItem(key);
          data[key] = value ? JSON.parse(value) : value;
        } catch {
          data[key] = sessionStorage.getItem(key);
        }
      }
    }
  }

  return {
    name: 'Session Data',
    description: 'Temporary data for your current browsing session',
    data,
    source: 'sessionStorage'
  };
}

/**
 * Collect data from cookies
 */
function collectCookiesData(): UserDataCategory {
  const data: Record<string, any> = {};
  
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        data[name] = decodeURIComponent(value || '');
      }
    });
  }

  return {
    name: 'Cookies',
    description: 'Small files stored by your browser',
    data,
    source: 'cookies'
  };
}

/**
 * Collect data from IndexedDB (if applicable)
 */
async function collectIndexedDBData(): Promise<UserDataCategory> {
  const data: Record<string, any> = {};
  
  if (typeof window !== 'undefined' && 'indexedDB' in window) {
    // Check for common IndexedDB databases
    try {
      const databases = await indexedDB.databases?.() || [];
      for (const db of databases) {
        if (db.name) {
          data[db.name] = { version: db.version, exists: true };
        }
      }
    } catch (e) {
      console.log('IndexedDB not accessible or not used');
    }
  }

  return {
    name: 'IndexedDB Data',
    description: 'Offline storage data',
    data,
    source: 'indexedDB'
  };
}

/**
 * Export user data in various formats
 */
export function exportUserData(report: UserDataReport, format: 'json' | 'html' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }
  
  // HTML format for human-readable export
  return generateHTMLReport(report);
}

/**
 * Generate HTML report for human-readable export
 */
function generateHTMLReport(report: UserDataReport): string {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Data Export - The Shadium</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        h1 { margin: 0 0 10px 0; }
        .meta {
            opacity: 0.9;
            font-size: 14px;
        }
        .category {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .category h2 {
            color: #667eea;
            margin-top: 0;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }
        .data-item {
            display: flex;
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
        }
        .data-key {
            font-weight: 600;
            color: #555;
            min-width: 200px;
        }
        .data-value {
            color: #777;
            word-break: break-word;
        }
        .summary {
            background: #e8f4f8;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .no-data {
            color: #999;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Your Data Export</h1>
        <div class="meta">
            <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
            <p>Request ID: ${report.requestId}</p>
            <p>Website: The Shadium (theshadium.com)</p>
        </div>
    </div>
    
    <div class="summary">
        <h3>Summary</h3>
        <p>Total data items: ${report.summary.totalItems}</p>
        <p>Data sources: ${report.summary.sources.join(', ')}</p>
        <p>Export size: ${(report.summary.totalSize / 1024).toFixed(2)} KB</p>
    </div>
    
    ${report.categories.map(category => `
        <div class="category">
            <h2>${category.name}</h2>
            <p>${category.description}</p>
            ${Object.keys(category.data).length > 0 ? 
                Object.entries(category.data).map(([key, value]) => `
                    <div class="data-item">
                        <div class="data-key">${key}:</div>
                        <div class="data-value">${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</div>
                    </div>
                `).join('') :
                '<p class="no-data">No data in this category</p>'
            }
        </div>
    `).join('')}
    
    <div class="footer">
        <p>This export contains all personal data we have stored about you.</p>
        <p>For questions about this data, contact: legal@theshadium.com</p>
        <p>&copy; ${new Date().getFullYear()} The Shadium. All rights reserved.</p>
    </div>
</body>
</html>
  `;
  
  return html;
}

/**
 * Delete all user data from all storage mechanisms
 */
export async function deleteAllUserData(options: {
  keepEssentialCookies?: boolean;
  confirmationCode?: string;
} = {}): Promise<{ success: boolean; deletedItems: number; errors: string[] }> {
  const errors: string[] = [];
  let deletedItems = 0;

  // Require confirmation code for safety
  if (options.confirmationCode !== 'DELETE-MY-DATA') {
    return {
      success: false,
      deletedItems: 0,
      errors: ['Invalid confirmation code. Please type DELETE-MY-DATA to confirm.']
    };
  }

  try {
    // 1. Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keysToDelete.push(key);
      }
      keysToDelete.forEach(key => {
        localStorage.removeItem(key);
        deletedItems++;
      });
    }
  } catch (e) {
    errors.push(`Failed to clear localStorage: ${e}`);
  }

  try {
    // 2. Clear sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.clear();
      deletedItems += sessionStorage.length;
    }
  } catch (e) {
    errors.push(`Failed to clear sessionStorage: ${e}`);
  }

  try {
    // 3. Clear cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name && (!options.keepEssentialCookies || !isEssentialCookie(name))) {
          // Delete cookie by setting expiry in the past
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
          deletedItems++;
        }
      });
    }
  } catch (e) {
    errors.push(`Failed to clear cookies: ${e}`);
  }

  try {
    // 4. Clear IndexedDB
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const databases = await indexedDB.databases?.() || [];
      for (const db of databases) {
        if (db.name) {
          await indexedDB.deleteDatabase(db.name);
          deletedItems++;
        }
      }
    }
  } catch (e) {
    errors.push(`Failed to clear IndexedDB: ${e}`);
  }

  // 5. Clear any service worker caches
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      deletedItems += cacheNames.length;
    }
  } catch (e) {
    errors.push(`Failed to clear caches: ${e}`);
  }

  // Log the deletion for audit purposes
  console.log(`[Privacy] Data deletion completed. Deleted ${deletedItems} items. Errors: ${errors.length}`);

  return {
    success: errors.length === 0,
    deletedItems,
    errors
  };
}

/**
 * Check if a cookie is essential for basic functionality
 */
function isEssentialCookie(name: string): boolean {
  const essentialCookies = [
    'session_id',
    'csrf_token',
    'security_token'
  ];
  return essentialCookies.includes(name.toLowerCase());
}

/**
 * Download data as a file
 */
export function downloadDataAsFile(data: string, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generate a privacy request audit log entry
 */
export function logPrivacyRequest(action: 'export' | 'delete', requestId: string): void {
  const logEntry = {
    action,
    requestId,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Store in sessionStorage for current session audit
  const logs = JSON.parse(sessionStorage.getItem('privacy_audit_log') || '[]');
  logs.push(logEntry);
  sessionStorage.setItem('privacy_audit_log', JSON.stringify(logs));
  
  console.log('[Privacy Audit]', logEntry);
}