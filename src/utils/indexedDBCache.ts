// IndexedDB caching for persistent offline storage
const DB_NAME = 'ShadiumCache';
const DB_VERSION = 1;
const STORE_NAME = 'apiCache';

interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  expiry: number;
}

class IndexedDBCache {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  // Initialize the database
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          store.createIndex('expiry', 'expiry', { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  // Get data from cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.get(key);
        
        request.onsuccess = () => {
          const entry: CacheEntry | undefined = request.result;
          
          if (!entry) {
            resolve(null);
            return;
          }

          // Check if expired
          if (Date.now() > entry.expiry) {
            this.delete(key); // Clean up expired entry
            resolve(null);
            return;
          }

          resolve(entry.data);
        };
        
        request.onerror = () => {
          console.error('IndexedDB get error:', request.error);
          resolve(null);
        };
      });
    } catch (error) {
      console.error('IndexedDB get error:', error);
      return null;
    }
  }

  // Set data in cache
  async set<T>(key: string, data: T, ttl: number = 3600000): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const entry: CacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      };

      store.put(entry);
      
      // Clean up old entries periodically
      this.cleanupExpired();
    } catch (error) {
      console.error('IndexedDB set error:', error);
    }
  }

  // Delete specific key
  async delete(key: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(key);
    } catch (error) {
      console.error('IndexedDB delete error:', error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
    } catch (error) {
      console.error('IndexedDB clear error:', error);
    }
  }

  // Clean up expired entries
  private async cleanupExpired(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('expiry');
      
      const now = Date.now();
      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('IndexedDB cleanup error:', error);
    }
  }

  // Get cache size
  async getSize(): Promise<number> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });
    } catch (error) {
      console.error('IndexedDB getSize error:', error);
      return 0;
    }
  }
}

// Create singleton instance
export const indexedDBCache = new IndexedDBCache();

// Wrapper for API calls with IndexedDB caching
export function withIndexedDBCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = `${cacheKey}:${JSON.stringify(args)}`;
    
    // Try to get from IndexedDB first
    const cached = await indexedDBCache.get(key);
    if (cached !== null) {
      console.log(`IndexedDB cache hit for ${key}`);
      return cached;
    }

    // Call the original function
    console.log(`IndexedDB cache miss for ${key}, calling API`);
    try {
      const result = await fn(...args);
      
      // Cache the result in IndexedDB
      await indexedDBCache.set(key, result, ttl);
      
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }) as T;
}