// IndexedDB Cache Manager for Shade Calculations
// Provides persistent caching with automatic expiry and versioning

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  version: string;
  expiresAt: number;
}

export interface CacheOptions {
  dbName?: string;
  storeName?: string;
  version?: number;
  defaultTTL?: number; // Time to live in milliseconds
}

const DEFAULT_OPTIONS: Required<CacheOptions> = {
  dbName: 'shadium-cache',
  storeName: 'shade-calculations',
  version: 1,
  defaultTTL: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export class CacheManager {
  private options: Required<CacheOptions>;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private currentVersion: string;

  constructor(options: CacheOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.currentVersion = '1.0.0'; // Increment when calculation logic changes
  }

  /**
   * Initialize the IndexedDB database
   */
  private async init(): Promise<void> {
    if (this.db) return;

    // Reuse existing initialization promise if in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise<void>((resolve, reject) => {
      // Check if IndexedDB is available
      if (typeof indexedDB === 'undefined') {
        console.warn('IndexedDB not available, cache will be disabled');
        resolve();
        return;
      }

      const request = indexedDB.open(this.options.dbName, this.options.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.options.storeName)) {
          const store = db.createObjectStore(this.options.storeName, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
          store.createIndex('version', 'version', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Generate cache key from parameters
   */
  generateKey(params: {
    stadiumId: string;
    date: Date;
    time: string;
    weather?: string;
  }): string {
    const dateStr = params.date.toISOString().split('T')[0];
    const weatherStr = params.weather || 'clear';
    return `${params.stadiumId}:${dateStr}:${params.time}:${weatherStr}`;
  }

  /**
   * Get cached data
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      await this.init();

      if (!this.db) return null;

      return new Promise<T | null>((resolve, reject) => {
        const transaction = this.db!.transaction([this.options.storeName], 'readonly');
        const store = transaction.objectStore(this.options.storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          const entry = request.result as CacheEntry<T> | undefined;

          if (!entry) {
            resolve(null);
            return;
          }

          // Check if entry has expired
          if (Date.now() > entry.expiresAt) {
            // Delete expired entry
            this.delete(key);
            resolve(null);
            return;
          }

          // Check version compatibility
          if (entry.version !== this.currentVersion) {
            // Delete outdated entry
            this.delete(key);
            resolve(null);
            return;
          }

          resolve(entry.data);
        };

        request.onerror = () => {
          console.error('Cache get error:', request.error);
          resolve(null); // Return null on error, don't reject
        };
      });
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cached data
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      await this.init();

      if (!this.db) return;

      const now = Date.now();
      const expiresAt = now + (ttl || this.options.defaultTTL);

      const entry: CacheEntry<T> = {
        key,
        data,
        timestamp: now,
        version: this.currentVersion,
        expiresAt
      };

      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([this.options.storeName], 'readwrite');
        const store = transaction.objectStore(this.options.storeName);
        const request = store.put(entry);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error('Cache set error:', request.error);
          resolve(); // Resolve anyway, don't block on cache errors
        };
      });
    } catch (error) {
      console.error('Cache set error:', error);
      // Don't throw, just log
    }
  }

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<void> {
    try {
      await this.init();

      if (!this.db) return;

      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([this.options.storeName], 'readwrite');
        const store = transaction.objectStore(this.options.storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error('Cache delete error:', request.error);
          resolve();
        };
      });
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clear(): Promise<void> {
    try {
      await this.init();

      if (!this.db) return;

      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([this.options.storeName], 'readwrite');
        const store = transaction.objectStore(this.options.storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error('Cache clear error:', request.error);
          resolve();
        };
      });
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Clear expired entries
   */
  async clearExpired(): Promise<number> {
    try {
      await this.init();

      if (!this.db) return 0;

      return new Promise<number>((resolve, reject) => {
        const transaction = this.db!.transaction([this.options.storeName], 'readwrite');
        const store = transaction.objectStore(this.options.storeName);
        const index = store.index('expiresAt');
        const now = Date.now();

        // Get all entries that have expired
        const request = index.openCursor(IDBKeyRange.upperBound(now));
        let deletedCount = 0;

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            deletedCount++;
            cursor.continue();
          } else {
            resolve(deletedCount);
          }
        };

        request.onerror = () => {
          console.error('Cache clearExpired error:', request.error);
          resolve(0);
        };
      });
    } catch (error) {
      console.error('Cache clearExpired error:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  }> {
    try {
      await this.init();

      if (!this.db) {
        return {
          totalEntries: 0,
          totalSize: 0,
          oldestEntry: null,
          newestEntry: null
        };
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.options.storeName], 'readonly');
        const store = transaction.objectStore(this.options.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          const entries = request.result as CacheEntry<any>[];

          let totalSize = 0;
          let oldestEntry: number | null = null;
          let newestEntry: number | null = null;

          entries.forEach(entry => {
            totalSize += JSON.stringify(entry.data).length;

            if (oldestEntry === null || entry.timestamp < oldestEntry) {
              oldestEntry = entry.timestamp;
            }
            if (newestEntry === null || entry.timestamp > newestEntry) {
              newestEntry = entry.timestamp;
            }
          });

          resolve({
            totalEntries: entries.length,
            totalSize,
            oldestEntry,
            newestEntry
          });
        };

        request.onerror = () => {
          console.error('Cache getStats error:', request.error);
          resolve({
            totalEntries: 0,
            totalSize: 0,
            oldestEntry: null,
            newestEntry: null
          });
        };
      });
    } catch (error) {
      console.error('Cache getStats error:', error);
      return {
        totalEntries: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null
      };
    }
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

// Export singleton instance
export const shadeCalculationCache = new CacheManager({
  dbName: 'shadium-cache',
  storeName: 'shade-calculations',
  defaultTTL: 7 * 24 * 60 * 60 * 1000 // 7 days
});
